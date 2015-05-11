if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

      var container, stereoStatus, varControl, addVarControls;

      var camera, scene, renderer, effect, element;

      var mesh, lightMesh, geometry;
      var spheres = [];
      var cubes = [];


      var directionalLight, pointLight;

      var mouseX = 0, mouseY = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      

      init();
      // animate();

      function init() {

        container = document.createElement( 'div' );
        container.id = 'container';
        document.body.appendChild( container );

        // Stereo Button
        var stereoButton = document.createElement('button');
        stereoButton.id = 'steroButton';
        stereoButton.textContent = "VR Mode";
        stereoButton.addEventListener('click', stereoToggle)
        container.appendChild(stereoButton);
        stereoStatus = true;

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z = 3200;

        scene = new THREE.Scene();

        // var path = "textures/cube/skybox/";
        var format = '.png';
        // var urls = [
        //   path + 'px' + format, path + 'nx' + format,
        //   path + 'py' + format, path + 'ny' + format,
        //   path + 'pz' + format, path + 'nz' + format
        // ];

        var urls = [
          '../images/TropicalSunnyDay/left.png',
          '../images/TropicalSunnyDay/right.png',
          '../images/TropicalSunnyDay/top.png',
          '../images/TropicalSunnyDay/bottom.png',
          '../images/TropicalSunnyDay/front.png',
          '../images/TropicalSunnyDay/back.png'
        ];

        // Spheres
        var geometry = new THREE.SphereGeometry( 100, 32, 16 );
        var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );

        for ( var i = 0; i < 300; i ++ ) {

          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.x = Math.random() * 10000 - 5000;
          mesh.position.y = Math.random() * 10000 - 5000;
          mesh.position.z = Math.random() * 10000 - 5000;
          mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
          scene.add( mesh );
          spheres.push( mesh );
        }

        // Cubes
        var geometry = new THREE.BoxGeometry( 200, 200, 200, 1, 1, 1 );
        var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );

        for ( var i = 0; i < 200; i ++ ) {
          var cube = new THREE.Mesh( geometry, material );
          cube.position.x = Math.random() * 10000 - 5000;
          cube.position.y = Math.random() * 10000 - 5000;
          cube.position.z = Math.random() * 10000 - 5000;
          cube.scale.x = cube.scale.y = cube.scale.z = Math.random() * 3 + 1;
          cube.name = 'cube';
          scene.add( cube );
          cubes.push( cube );
        }


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
          // this.scale = 1; 
        }; 

        addVarControls(varControl);

        function addVarControls(controlObject) {
          var gui = new dat.GUI();
          gui.add(controlObject, 'rotationSpeed', -0.1, 0.1);
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

      // function animate() {
      //   requestAnimationFrame( animate );
      //   render();
      // }

      function render(dt) {
        camera.updateProjectionMatrix(dt);
        controls.update(dt);

        var timer = 0.0001 * Date.now();

        for ( var i = 0, il = spheres.length; i < il; i ++ ) {
          var sphere = spheres[ i ];
          sphere.position.x = 5000 * Math.cos( timer + i );
          sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

        }

        for ( var i = 0, il = cubes.length; i < il; i ++ ) {
          var cube = cubes[ i ];
          cube.position.x = 5000 * Math.cos( timer + i );
          cube.position.y = 5000 * Math.sin( timer + i * 1.1 );

          cube.rotation.y += varControl.rotationSpeed;
          // cube.scale.set(varControl.scale, varControl.scale, varControl.scale);
        }

        if(stereoStatus){
          effect.render( scene, camera );
        }
        else {
          renderer.render( scene, camera );
        }

        requestAnimationFrame( render );

      }