if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

      var container, stereoStatus, varControl, addVarControls;

      var camera, scene, renderer, effect, element;

      var mesh, lightMesh, geometry, pivotPoint, cube;
      var spheres = [];

      var directionalLight, pointLight;

      var mouseX = 0, mouseY = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      
      init();
      animate();

      function init() {

        container = document.createElement( 'div' );
        container.id = 'container';
        document.body.appendChild( container );
        stereoStatus = true;

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z = 100;
        camera.position.y = 500;

        scene = new THREE.Scene();

        var urls = [
          '../images/small-stars/right.png',
          '../images/small-stars/left.png',
          '../images/small-stars/top.png',
          '../images/small-stars/bottom.png',
          '../images/small-stars/front.png',
          '../images/small-stars/back.png'
        ];

        
        // Cubes
        var geometry = new THREE.BoxGeometry( 1500, 1500, 1500, 1, 1, 1 );
        var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.99 } );

        // for ( var i = 0; i < 200; i ++ ) {
          cube = new THREE.Mesh( geometry, material );
          cube.position.x = 5800;
          cube.position.y = -1000;
          cube.name = 'cube';
          scene.add( cube );
          // cubes.push( cube );
        // }

        // add an object as pivot point to the sphere 
          pivotPoint = new THREE.Object3D(); 
          cube.add(pivotPoint);

       
        // Spheres
        var geometry = new THREE.SphereGeometry( 100, 32, 16 );
        var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
        var material = new THREE.MeshBasicMaterial( { color: "#d7dbd0", envMap: textureCube, refractionRatio: 0.99 } );
        
        var datGUI  = new dat.GUI() 

        for ( var i = 0; i < 20; i ++ ) {
          var mesh = new THREE.Mesh( geometry, material );
          glowMesh  = new THREEx.GeometricGlowMesh(mesh);
          // mesh.position.x = Math.random() * 4500 - 3500;
          // mesh.position.y = Math.random() * 700 - 500;
          // mesh.position.z = 4000;
          var rndm = Math.random() * 12500 - 6500;

          if(rndm > 1000 || rndm < -1000) {
            mesh.position.x = rndm
          }
          else {
            rndm = Math.random() * 1000 + 10000;
            mesh.position.x = rndm
          }
      
          mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
          mesh.add(glowMesh.object3d)
          pivotPoint.add( mesh );
          spheres.push( mesh );
        }

        new THREEx.addAtmosphereMaterial2DatGui(glowMesh.insideMesh.material, datGUI)
          

        // Skybox

        var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = textureCube;

        var material = new THREE.ShaderMaterial( {
          fragmentShader: shader.fragmentShader,
          vertexShader: shader.vertexShader,
          uniforms: shader.uniforms,
          side: THREE.BackSide
        } ),

        mesh = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000 ), material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        // renderer.setPixelRatio( window.devicePixelRatio );
        container.appendChild( element );

        effect = new THREE.StereoEffect( renderer );
        effect.eyeSeparation = 10;
        effect.setSize( window.innerWidth, window.innerHeight );

        controls = new THREE.OrbitControls(camera, element);
        controls.rotateUp(Math.PI / 4);
        controls.target.set(
          camera.position.x + 0.1,
          camera.position.y,
          camera.position.z
        );
        controls.noZoom = true;
        controls.noPan = true;


        //variable control object
        varControl = new function() { 
          this.rotationSpeed = 0.010;
          this.sphereGlowPower = 1.4;
          this.sphereOrbitSpeedX = 0.00001;
          this.rotationSpeedX = 0.00001;
          this.rotationSpeedY = 0.00001;
          this.rotationSpeedZ = 0.00001;
          this.rotationX = 0.00001;
          this.rotationY = 0.00001;
          this.rotationZ = 0.00001;

          this.stereoToggle = function() {
          stereoStatus = !stereoStatus;
          windowHalfX = window.innerWidth,
          windowHalfY = window.innerHeight,
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          effect.setSize( window.innerWidth, window.innerHeight );
        }
          // this.scale = 1; 
        }; 

        addVarControls(varControl);

        function addVarControls(controlObject) {
          var gui = new dat.GUI();
          gui.add(controlObject, 'rotationSpeed', -0.1, 0.1);
          gui.add(controlObject, 'stereoToggle').name('VR Mode');
          gui.add(controlObject, 'sphereGlowPower', 0, 3);
          gui.add(controlObject, 'sphereOrbitSpeedX', -0.2, 0.2);
          gui.add(controlObject, 'rotationSpeedX', -0.2, 0.2);
          gui.add(controlObject, 'rotationSpeedY', -0.2, 0.2);
          gui.add(controlObject, 'rotationSpeedZ', -0.2, 0.2);
          gui.add(controlObject, 'rotationX').onChange(function (v) {
              pivotPoint.rotation.x = v
          });
          gui.add(controlObject, 'rotationY').onChange(function (v) {
              pivotPoint.rotation.y = v
          });
          gui.add(controlObject, 'rotationZ').onChange(function (v) {
              pivotPoint.rotation.z = v
          });
            // gui.add(controlObject, 'scale', 0.01, 2);
          }

        window.addEventListener('deviceorientation', setOrientationControls, true);
        window.addEventListener( 'resize', onWindowResize, false );
        render();
      }



      function setOrientationControls( event ) {
        if (!event.alpha) {
          return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
        // element.addEventListener('click', fullscreen, false);
      }

      function stereoToggle() {
        stereoStatus = !stereoStatus;
        windowHalfX = window.innerWidth,
        windowHalfY = window.innerHeight,
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        effect.setSize( window.innerWidth, window.innerHeight );
      }

      function onWindowResize() {
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2,
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        effect.setSize( window.innerWidth, window.innerHeight );
      }

      function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX ) * 10;
        mouseY = ( event.clientY - windowHalfY ) * 10;
      }

      function animate() {
        var timer = 0.0001 * Date.now();
        pivotPoint.rotation.x += varControl.sphereOrbitSpeedX;
        pivotPoint.rotation.x += varControl.rotationSpeedX;
        pivotPoint.rotation.y += varControl.rotationSpeedY;
        pivotPoint.rotation.z += varControl.rotationSpeedZ;
        pivotPoint.rotationX = varControl.rotationX;
        pivotPoint.rotationY = varControl.rotationY;
        pivotPoint.rotationZ = varControl.rotationZ;

        for ( var i = 0, il = spheres.length; i < il; i ++ ) {
          var sphere = spheres[ i ];
          sphere.position.z = 5000 * Math.sin( timer + i * 1.1 );
        }

        cube.rotation.y += varControl.rotationSpeed;

        // for ( var i = 0, il = cubes.length; i < il; i ++ ) {
        //   var cube = cubes[ i ];
        //   cube.position.x = 5000 * Math.cos( timer + i );
        //   cube.position.y = 5000 * Math.sin( timer + i * 1.1 );
        //   cube.rotation.y += varControl.rotationSpeed;
        //   // cube.scale.set(varControl.scale, varControl.scale, varControl.scale);
        // }

        camera.updateProjectionMatrix();
        requestAnimationFrame( animate );
        render();
      }

      function render() {

        if(stereoStatus){
          effect.render( scene, camera );

        }
        else {
          renderer.render( scene, camera );
        }
      }