// Get WebGL context
const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL not supported");
  throw new Error("WebGL not supported");
}

// Vertex shader source
const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_normal;
    
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_projectionMatrix;
    uniform mat3 u_normalMatrix;
    
    varying vec3 v_normal;
    varying vec3 v_position;
    
    void main() {
        vec4 worldPosition = u_modelMatrix * vec4(a_position, 1.0);
        v_position = worldPosition.xyz;
        v_normal = u_normalMatrix * a_normal;
        
        gl_Position = u_projectionMatrix * u_viewMatrix * worldPosition;
    }
`;

// Fragment shader source
const fragmentShaderSource = `
    precision mediump float;
    
    varying vec3 v_normal;
    varying vec3 v_position;
    
    uniform vec3 u_lightPosition;
    uniform vec3 u_lightColor;
    uniform vec3 u_sphereColor;
    uniform vec3 u_cameraPosition;
    
    void main() {
        vec3 normal = normalize(v_normal);
        vec3 lightDirection = normalize(u_lightPosition - v_position);
        vec3 viewDirection = normalize(u_cameraPosition - v_position);
        vec3 reflectDirection = reflect(-lightDirection, normal);
        
        // Ambient
        vec3 ambient = 0.3 * u_sphereColor;
        
        // Diffuse
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse = diff * u_lightColor * u_sphereColor;
        
        // Specular
        float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), 32.0);
        vec3 specular = spec * u_lightColor;
        
        vec3 result = ambient + diffuse + specular;
        gl_FragColor = vec4(result, 1.0);
    }
`;

// Create shader function
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Create program function
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking program:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

// Generate sphere geometry
function createSphere(radius, latitudeBands, longitudeBands) {
  const vertices = [];
  const normals = [];
  const indices = [];

  for (let lat = 0; lat <= latitudeBands; lat++) {
    const theta = (lat * Math.PI) / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longitudeBands; lon++) {
      const phi = (lon * 2 * Math.PI) / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      vertices.push(radius * x, radius * y, radius * z);
      normals.push(x, y, z);
    }
  }

  for (let lat = 0; lat < latitudeBands; lat++) {
    for (let lon = 0; lon < longitudeBands; lon++) {
      const first = lat * (longitudeBands + 1) + lon;
      const second = first + longitudeBands + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return { vertices, normals, indices };
}

// Matrix operations
function createMatrix4() {
  return new Float32Array(16);
}

function identity(matrix) {
  matrix[0] = 1;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 0;
  matrix[5] = 1;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = 1;
  matrix[11] = 0;
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = 0;
  matrix[15] = 1;
  return matrix;
}

function perspective(matrix, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);

  identity(matrix);
  matrix[0] = f / aspect;
  matrix[5] = f;
  matrix[10] = (far + near) * nf;
  matrix[11] = -1;
  matrix[14] = 2 * far * near * nf;
  matrix[15] = 0;
  return matrix;
}

function lookAt(matrix, eye, target, up) {
  const zAxis = normalize([
    eye[0] - target[0],
    eye[1] - target[1],
    eye[2] - target[2],
  ]);
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = cross(zAxis, xAxis);

  matrix[0] = xAxis[0];
  matrix[1] = yAxis[0];
  matrix[2] = zAxis[0];
  matrix[3] = 0;
  matrix[4] = xAxis[1];
  matrix[5] = yAxis[1];
  matrix[6] = zAxis[1];
  matrix[7] = 0;
  matrix[8] = xAxis[2];
  matrix[9] = yAxis[2];
  matrix[10] = zAxis[2];
  matrix[11] = 0;
  matrix[12] = -dot(xAxis, eye);
  matrix[13] = -dot(yAxis, eye);
  matrix[14] = -dot(zAxis, eye);
  matrix[15] = 1;
  return matrix;
}

function rotateY(matrix, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  identity(matrix);
  matrix[0] = c;
  matrix[2] = s;
  matrix[8] = -s;
  matrix[10] = c;
  return matrix;
}

function normalize(v) {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalMatrix(modelMatrix) {
  // Extract 3x3 from 4x4 and transpose
  return new Float32Array([
    modelMatrix[0],
    modelMatrix[4],
    modelMatrix[8],
    modelMatrix[1],
    modelMatrix[5],
    modelMatrix[9],
    modelMatrix[2],
    modelMatrix[6],
    modelMatrix[10],
  ]);
}

// Initialize WebGL
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);
const program = createProgram(gl, vertexShader, fragmentShader);

// Get attribute and uniform locations
const positionLocation = gl.getAttribLocation(program, "a_position");
const normalLocation = gl.getAttribLocation(program, "a_normal");
const modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
const viewMatrixLocation = gl.getUniformLocation(program, "u_viewMatrix");
const projectionMatrixLocation = gl.getUniformLocation(
  program,
  "u_projectionMatrix"
);
const normalMatrixLocation = gl.getUniformLocation(program, "u_normalMatrix");
const lightPositionLocation = gl.getUniformLocation(program, "u_lightPosition");
const lightColorLocation = gl.getUniformLocation(program, "u_lightColor");
const sphereColorLocation = gl.getUniformLocation(program, "u_sphereColor");
const cameraPositionLocation = gl.getUniformLocation(
  program,
  "u_cameraPosition"
);

// Create sphere geometry
const sphere = createSphere(1.0, 30, 30);

// Create buffers
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(sphere.vertices),
  gl.STATIC_DRAW
);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(sphere.normals),
  gl.STATIC_DRAW
);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(sphere.indices),
  gl.STATIC_DRAW
);

// Set up matrices
const modelMatrix = createMatrix4();
const viewMatrix = createMatrix4();
const projectionMatrix = createMatrix4();

// Camera and lighting setup
const cameraPosition = [0, 0, 5];
const lightPosition = [5, 5, 5];
const lightColor = [1.0, 1.0, 1.0];
const sphereColor = [0.3, 0.7, 1.0];

// Set up perspective projection
perspective(
  projectionMatrix,
  Math.PI / 4,
  canvas.width / canvas.height,
  0.1,
  100.0
);

// Set up view matrix
lookAt(viewMatrix, cameraPosition, [0, 0, 0], [0, 1, 0]);

// Animation variables
let rotation = 0;

// Render function
function render() {
  // Clear canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);

  // Use shader program
  gl.useProgram(program);

  // Update rotation
  rotation += 0.01;
  rotateY(modelMatrix, rotation);

  // Set uniforms
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
  gl.uniformMatrix3fv(normalMatrixLocation, false, normalMatrix(modelMatrix));
  gl.uniform3fv(lightPositionLocation, lightPosition);
  gl.uniform3fv(lightColorLocation, lightColor);
  gl.uniform3fv(sphereColorLocation, sphereColor);
  gl.uniform3fv(cameraPositionLocation, cameraPosition);

  // Bind position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  // Bind normal buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.enableVertexAttribArray(normalLocation);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

  // Bind index buffer and draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

  // Request next frame
  requestAnimationFrame(render);
}

// Start rendering
render();
