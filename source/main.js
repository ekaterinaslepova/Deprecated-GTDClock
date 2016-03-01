/**
 * Created by nebel on 21.11.2015.
 */

(function() {

    var controller, renderer, ctx, bg_ctx;

    function init() {
        initPane();
        initMVC();
        initMenu();
        initListeners();
    }

    function initPane() {
        ctx = initMainCanvas();
        bg_ctx = initBackgroundCanvas();
    }

    function initMainCanvas() {
        var pane = document.getElementById('pane'),
            ctx = pane.getContext("2d");

        pane.width = window.innerWidth;
        pane.height = window.innerHeight;

        ctx.lineWidth = 5;
        ctx.translate(pane.width / 2, pane.height / 2);

        return ctx;
    }

    function initBackgroundCanvas() {
        var pane = document.createElement('canvas'),
            ctx = pane.getContext("2d");

        pane.width = window.innerWidth;
        pane.height = window.innerHeight;

        ctx.lineWidth = 5;
        ctx.translate(pane.width / 2, pane.height / 2);

        return ctx;
    }

    function initMenu() {
        var pane = document.getElementById('pane'),
            editIcon = document.getElementById('edit_icon'),
            addBtn = document.getElementById('add'),
            removeBtn = document.getElementById('remove'),
            drawBtn = document.getElementById('draw');

        //pane.addEventListener('click', function() {
        //    var menu = document.getElementById('menu');
        //    menu.classList.add('hidden');
        //});

        editIcon.addEventListener('click', function() {
            var menu = document.getElementById('menu');
            menu.classList.remove('hidden');
        });

        addBtn.addEventListener('click', function() {
            controller.addSector();
        });

        removeBtn.addEventListener('click', function() {
            controller.removeSector();
        });

        drawBtn.addEventListener('click', function() {
            controller.addActivity();
        });
    }

    function initMVC() {
        var model, view, clock;
        model = new SectorModel();
        view = new SectorView(ctx, bg_ctx, 200, model);
        controller = new SectorController(model, view);
        clock = new Clock(ctx, 200);
        renderer = new Renderer(view, clock);
    }

    function initListeners() {
        var pane = document.getElementById('pane'),
            mousedown = false,
            allowToMove = true;

        pane.addEventListener('click', function(event) {
            var pixel = bg_ctx.getImageData(event.x, event.y, 1, 1).data;
            if (pane.style.cursor == 'pointer' && controller.isSelectable(pixel)) {
                controller.selectSector(event.clientX, event.clientY);
            }
        });

        pane.addEventListener('mousedown', function (event) {
            mousedown = true;
            controller.activateMove(event.clientX, event.clientY);
        });

        pane.addEventListener('mouseup', function () {
            mousedown = false;
            controller.deactivateMove();
        });

        pane.addEventListener('mousemove', function (event) {
            if (mousedown) {
                if (pane.style.cursor == 'move') {
                    if (allowToMove === true) {
                        controller.moveSector(event.clientX, event.clientY);
                        allowToMove = false;
                        setTimeout(function() {
                            allowToMove = true;
                        }, 200);
                    }
                }
            }
            else {
                var pixel = bg_ctx.getImageData(event.x, event.y, 1, 1).data;
                if (controller.isSelectable(pixel)) {
                    pane.style.cursor = 'pointer';
                }
                else if (controller.isMovable(pixel)) {
                    pane.style.cursor = 'move';
                }
                else {
                    pane.style.cursor = 'default';
                }
            }
        });
    }

    init();
})();