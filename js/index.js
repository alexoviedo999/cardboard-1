
    var camera, scene, renderer;
    var effect, controls;
    var element, container, cubeGroup;

    var clock = new THREE.Clock();

    init();
    animate();


    function init() {
      renderer = new THREE.WebGLRenderer();
      element = renderer.domElement;
      container = document.getElementById('example');
      container.appendChild(element);

      effect = new THREE.StereoEffect(renderer);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
      camera.position.set(0, 10, 0);
      scene.add(camera);

      controls = new THREE.OrbitControls(camera, element);
      controls.rotateUp(Math.PI / 4);
      controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
      );
      controls.noZoom = true;
      controls.noPan = true;


      function setOrientationControls(e) {
        if (!e.alpha) {
          return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
      }


      window.addEventListener('deviceorientation', setOrientationControls, true);


      var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
      scene.add(light);

      var texture = THREE.ImageUtils.loadTexture(
        'textures/patterns/checker.png'
      );

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat = new THREE.Vector2(50, 50);
      texture.anisotropy = renderer.getMaxAnisotropy();

      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
      });

      cubeGroup = new THREE.Object3D;

      // Plane
      var geometry = new THREE.PlaneGeometry(1000, 1000);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      // cubeGroup.add(mesh);

      // Cube
      var cubeTexture = THREE.ImageUtils.loadTexture("textures/patterns/9452.jpg");
      var cubeMaterial = new THREE.MeshPhongMaterial({ map: cubeTexture });
      var geometry = new THREE.BoxGeometry(10, 10, 10);
      cube = new THREE.Mesh(geometry, cubeMaterial);
      cube.position.z = 5;
      cube.position.y = 10;
      cube.position.x = 30;
      cube.rotation.y = Math.PI / 5;
      cubeGroup.add(cube);

      // Sphere
      var sphereTexture = THREE.ImageUtils.loadTexture("textures/patterns/9452.jpg");
      var sphereMaterial = new THREE.MeshPhongMaterial({ map: sphereTexture});
      var sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.x = 20;
      sphere.position.y = 5;
      cubeGroup.add(sphere);



      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);

      scene.add(mesh);
      scene.add(cubeGroup);
    }

    function rotateScene(deltax) {
      cubeGroup.rotation.y += 4 / 100;
      // $("#rotation").html("rotation: 0," + cubeGroup.rotation.y.toFixed(2) + ",0");
    }



    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      effect.setSize(width, height);
    }

    function update(dt) {
      resize();

      camera.updateProjectionMatrix();

      controls.update(dt);
    }

    function render(dt) {
      effect.render(scene, camera);
    }

    var duration = 5000; // ms
    var currentTime = Date.now();

    function animate(t) {
      requestAnimationFrame(animate);

      update(clock.getDelta());
      render(clock.getDelta());

      rotateScene();
      // var now = Date.now();
      // var deltat = now - currentTime;
      // currentTime = now;
      // var fract = deltat / duration;
      // var angle = Math.PI * 2 * fract;
      // cubeGroup.rotation.y += angle;
    }

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }
  
