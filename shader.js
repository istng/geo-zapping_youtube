document.addEventListener('DOMContentLoaded', function() {
    // Initialize YouTube manager
    const youtubeManager = new YouTubeManager('video-container');
    
    const canvas = document.getElementById('shader-canvas');
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }
    
    // Shader visibility state
    let shadersEnabled = true;
    
    // Function to toggle shader visibility
    function toggleShaders() {
        shadersEnabled = !shadersEnabled;
        canvas.style.display = shadersEnabled ? 'block' : 'none';
        updateShaderInfo();
    }
    
    // Shader management
    const shaders = [
        {
            name: "Colorful Waves",
            fragmentShader: `
                precision highp float;
                varying highp vec2 vTextureCoord;
                uniform float uTime;
                
                void main(void) {
                    vec2 uv = vTextureCoord;
                    
                    // Create a colorful wave pattern
                    float r = 0.5 + 0.5 * sin(uv.x * 10.0 + uTime);
                    float g = 0.5 + 0.5 * sin(uv.y * 10.0 + uTime * 0.7);
                    float b = 0.5 + 0.5 * sin((uv.x + uv.y) * 5.0 + uTime * 1.3);
                    
                    // Add some moving waves
                    float wave = sin((uv.y * 20.0) + (uv.x * 10.0) + uTime * 2.0) * 0.1;
                    r += wave;
                    g += wave;
                    b += wave;
                    
                    gl_FragColor = vec4(r, g, b, 0.5); // Semi-transparent
                }
            `
        },
        {
            name: "Plasma Effect",
            fragmentShader: `
                precision highp float;
                varying highp vec2 vTextureCoord;
                uniform float uTime;
                
                void main(void) {
                    vec2 uv = vTextureCoord;
                    
                    float v1 = sin(uv.x * 10.0 + uTime);
                    float v2 = sin(10.0 * (uv.x * sin(uTime / 2.0) + uv.y * cos(uTime / 3.0)) + uTime);
                    float v3 = sin(sqrt(100.0 * (uv.x * uv.x + uv.y * uv.y) + 1.0) + uTime);
                    
                    float cx = uv.x + sin(uTime / 5.0) * 0.5;
                    float cy = uv.y + cos(uTime / 3.0) * 0.5;
                    float v4 = sin(sqrt(100.0 * ((cx * cx) + (cy * cy))) + uTime);
                    
                    float plasma = (v1 + v2 + v3 + v4) / 4.0;
                    
                    float r = 0.5 + 0.5 * sin(plasma * 3.14159 + 0.0);
                    float g = 0.5 + 0.5 * sin(plasma * 3.14159 + 2.094);
                    float b = 0.5 + 0.5 * sin(plasma * 3.14159 + 4.188);
                    
                    gl_FragColor = vec4(r, g, b, 0.6);
                }
            `
        },
        {
            name: "Kaleidoscope",
            fragmentShader: `
                precision highp float;
                varying highp vec2 vTextureCoord;
                uniform float uTime;
                
                void main(void) {
                    vec2 uv = vTextureCoord * 2.0 - 1.0;
                    
                    // Polar coordinates
                    float radius = length(uv);
                    float angle = atan(uv.y, uv.x);
                    
                    // Kaleidoscope effect
                    float segments = 8.0;
                    angle = mod(angle, 3.14159 * 2.0 / segments) - 3.14159 / segments;
                    
                    // Back to Cartesian
                    uv = radius * vec2(cos(angle), sin(angle));
                    
                    // Animate
                    uv += sin(uTime * 0.5) * 0.1;
                    
                    // Colors
                    float r = 0.5 + 0.5 * sin(radius * 5.0 - uTime);
                    float g = 0.5 + 0.5 * sin(radius * 7.0 - uTime * 1.3 + 2.0);
                    float b = 0.5 + 0.5 * sin(angle * 6.0 + uTime * 0.7);
                    
                    gl_FragColor = vec4(r, g, b, 0.5);
                }
            `
        },
        {
            name: "Ripple",
            fragmentShader: `
                precision highp float;
                varying highp vec2 vTextureCoord;
                uniform float uTime;
                
                void main(void) {
                    vec2 uv = vTextureCoord * 2.0 - 1.0;
                    float dist = length(uv);
                    
                    // Create ripple effect
                    float ripple = sin(dist * 20.0 - uTime * 2.0) * 0.5 + 0.5;
                    
                    // Color based on distance and ripple
                    float r = ripple * (0.5 + 0.5 * sin(uTime));
                    float g = ripple * (0.5 + 0.5 * cos(uTime * 0.7));
                    float b = 0.5 + 0.5 * sin(dist * 5.0 + uTime);
                    
                    gl_FragColor = vec4(r, g, b, 0.5);
                }
            `
        },
        {
            name: "Psychedelic Moiré",
            fragmentShader: `
                precision highp float;
                varying highp vec2 vTextureCoord;
                uniform float uTime;
                
                float pattern(vec2 p, float time) {
                    // Create multiple overlapping circular patterns
                    float scale1 = 15.0;
                    float scale2 = 12.0;
                    float scale3 = 9.0;
                    
                    // Animated centers for the patterns
                    vec2 center1 = vec2(0.5 + 0.3 * sin(time * 0.4), 0.5 + 0.3 * cos(time * 0.3));
                    vec2 center2 = vec2(0.5 + 0.4 * cos(time * 0.5), 0.5 + 0.4 * sin(time * 0.6));
                    vec2 center3 = vec2(0.5 + 0.2 * sin(time * 0.7), 0.5 + 0.2 * cos(time * 0.8));
                    
                    // Calculate distances from centers
                    float d1 = length((p - center1) * scale1);
                    float d2 = length((p - center2) * scale2);
                    float d3 = length((p - center3) * scale3);
                    
                    // Create circular patterns
                    float pattern1 = sin(d1 - time);
                    float pattern2 = sin(d2 - time * 1.5);
                    float pattern3 = sin(d3 - time * 0.7);
                    
                    // Combine patterns with different weights
                    return pattern1 * 0.5 + pattern2 * 0.3 + pattern3 * 0.2;
                }
                
                void main(void) {
                    vec2 uv = vTextureCoord;
                    
                    // Apply distortion to UV coordinates
                    float distortionX = sin(uv.y * 10.0 + uTime * 0.5) * 0.02;
                    float distortionY = cos(uv.x * 8.0 + uTime * 0.6) * 0.02;
                    vec2 distortedUV = uv + vec2(distortionX, distortionY);
                    
                    // Generate base pattern
                    float p = pattern(distortedUV, uTime);
                    
                    // Create color bands based on the pattern
                    vec3 color;
                    color.r = 0.5 + 0.5 * sin(p * 3.14159 + uTime * 0.5);
                    color.g = 0.5 + 0.5 * sin(p * 3.14159 + uTime * 0.3 + 2.0);
                    color.b = 0.5 + 0.5 * sin(p * 3.14159 + uTime * 0.7 + 4.0);
                    
                    // Add zebra-like stripes
                    float stripePattern = sin(distortedUV.x * 40.0 + distortedUV.y * 40.0 + uTime * 2.0);
                    float stripeIntensity = smoothstep(0.3, 0.7, abs(stripePattern));
                    
                    // Mix colors with stripes
                    vec3 stripeColor = vec3(stripeIntensity);
                    color = mix(color, stripeColor, 0.3);
                    
                    // Add circular highlights
                    float highlight = smoothstep(0.4, 0.6, sin(length(uv - 0.5) * 10.0 - uTime));
                    color = mix(color, vec3(1.0), highlight * 0.2);
                    
                    gl_FragColor = vec4(color, 0.7);
                }
            `
        },
        {
            name: "RGB Vortex Tunnel",
            fragmentShader: `
                precision highp float;
                varying highp vec2 vTextureCoord;
                uniform float uTime;
                
                void main(void) {
                    // Center the coordinates
                    vec2 uv = vTextureCoord * 2.0 - 1.0;
                    
                    // Create aspect ratio correction
                    float aspect = 1.0;
                    uv.x *= aspect;
                    
                    // Calculate distance from center and angle
                    float dist = length(uv);
                    float angle = atan(uv.y, uv.x);
                    
                    // Create the tunnel effect
                    float tunnelDepth = 30.0;
                    float tunnelSpeed = uTime * 2.0;
                    
                    // Distort the UV coordinates to create a 3D tunnel effect
                    float z = 1.0 / (dist * 3.0 + 0.1);
                    
                    // Create animated rotation
                    float rotationSpeed = uTime * 0.3;
                    float rotatedAngle = angle + rotationSpeed;
                    
                    // Create RGB separation based on angle and distance
                    float r = 0.5 + 0.5 * sin(rotatedAngle * 3.0 + z * tunnelDepth - tunnelSpeed);
                    float g = 0.5 + 0.5 * sin(rotatedAngle * 3.0 + z * tunnelDepth - tunnelSpeed + 2.094);
                    float b = 0.5 + 0.5 * sin(rotatedAngle * 3.0 + z * tunnelDepth - tunnelSpeed + 4.188);
                    
                    // Create concentric rings
                    float rings = sin(z * tunnelDepth * 1.5 - tunnelSpeed * 0.5) * 0.5 + 0.5;
                    rings = smoothstep(0.3, 0.7, rings);
                    
                    // Create radial lines
                    float lines = sin(rotatedAngle * 20.0) * 0.5 + 0.5;
                    lines = smoothstep(0.4, 0.6, lines);
                    
                    // Combine rings and lines
                    float pattern = mix(rings, lines, 0.5);
                    
                    // Apply pattern to colors
                    vec3 color = vec3(r, g, b);
                    color = mix(color, vec3(1.0), pattern * 0.6);
                    
                    // Add pulsing brightness at the center
                    float centerGlow = 1.0 / (dist * 5.0 + 0.1);
                    centerGlow *= 0.2 + 0.1 * sin(uTime * 3.0);
                    color += vec3(centerGlow);
                    
                    // Add some noise to break up the perfect patterns
                    float noise = fract(sin(dot(vTextureCoord, vec2(12.9898, 78.233))) * 43758.5453);
                    color += noise * 0.02;
                    
                    gl_FragColor = vec4(color, 0.8);
                }
            `
        } 
    ];
    
    let currentShaderIndex = 0;
    
    // Function to change the shader
    function changeShader(index) {
        currentShaderIndex = index;
        updateShaderInfo();
        
        // Recompile shader program
        const shaderProgram = initShaderProgram(gl, vsSource, shaders[currentShaderIndex].fragmentShader);
        
        // Update program info
        programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            },
            uniformLocations: {
                time: gl.getUniformLocation(shaderProgram, 'uTime'),
            },
        };
    }
    
    // Update shader info display
    function updateShaderInfo() {
        const shaderInfo = document.getElementById('shader-info');
        if (shaderInfo) {
            const statusText = shadersEnabled ? 'ON' : 'OFF';
            shaderInfo.textContent = `Shader: ${shaders[currentShaderIndex].name} (${currentShaderIndex + 1}/${shaders.length}) - ${statusText}`;
        }
    }
    
    // Add keyboard event listener for shader controls
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            // Go to previous shader
            currentShaderIndex = (currentShaderIndex - 1 + shaders.length) % shaders.length;
            changeShader(currentShaderIndex);
        } else if (event.key === 'ArrowRight') {
            // Go to next shader
            currentShaderIndex = (currentShaderIndex + 1) % shaders.length;
            changeShader(currentShaderIndex);
        } else if (event.key === 's' || event.key === 'S') {
            // Toggle shader visibility
            toggleShaders();
        }
    });
    
    // Resize canvas to match window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;
        
        varying highp vec2 vTextureCoord;
        
        void main(void) {
            gl_Position = aVertexPosition;
            vTextureCoord = aTextureCoord;
        }
    `;
    
    // Initialize shader program
    function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        
        return shaderProgram;
    }
    
    // Create a shader
    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    // Initialize buffers
    function initBuffers(gl) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        // Create a square that covers the entire canvas
        const positions = [
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0,
        ];
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        
        const textureCoordinates = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
        ];
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        
        return {
            position: positionBuffer,
            textureCoord: textureCoordBuffer,
        };
    }
    
    // Draw the scene
    function drawScene(gl, programInfo, buffers, time) {
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Position attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            2, // 2 components per vertex
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        
        // Texture coordinate attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            2, // 2 components per texture coord
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        
        // Use the shader program
        gl.useProgram(programInfo.program);
        
        // Set the uniform
        gl.uniform1f(programInfo.uniformLocations.time, time);
        
        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    // Initialize shader program with the first shader
    let shaderProgram = initShaderProgram(gl, vsSource, shaders[currentShaderIndex].fragmentShader);
    
    // Collect all the info needed to use the shader program
    let programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            time: gl.getUniformLocation(shaderProgram, 'uTime'),
        },
    };
    
    // Initialize buffers
    const buffers = initBuffers(gl);
    
    // Animation loop
    let startTime = Date.now();
    function render() {
        const currentTime = (Date.now() - startTime) / 1000; // time in seconds
        drawScene(gl, programInfo, buffers, currentTime);
        requestAnimationFrame(render);
    }
    
    // Start the animation loop
    requestAnimationFrame(render);
    
    // Add instructions to the page
    const instructions = document.createElement('div');
    instructions.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.5); color: white; padding: 10px; border-radius: 5px; z-index: 3;">
            <p>Use ↑ and ↓ arrow keys to change videos</p>
            <p>Use ← and → arrow keys to change shader effects</p>
            <p>Press 'S' to toggle shaders on/off</p>
            <p id="shader-info">Shader: ${shaders[currentShaderIndex].name} (1/${shaders.length}) - ON</p>
        </div>
    `;
    document.body.appendChild(instructions);
}); 