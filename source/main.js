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

        pane.width = pane.parentElement.clientWidth;
        pane.height = pane.parentElement.clientHeight-55;

        ctx.lineWidth = 5;
        ctx.strokeStyle = "#414A6B";
        ctx.translate(pane.width / 2, pane.height / 2);

        return ctx;
    }

    function initBackgroundCanvas() {
        var pane = document.getElementById('pane'),
            bckg_pane = document.createElement('canvas'),
            ctx = bckg_pane.getContext("2d");

        bckg_pane.width = pane.width;
        bckg_pane.height = pane.height-55;

        ctx.lineWidth = 5;
        ctx.translate(pane.width / 2, pane.height / 2);

        return ctx;
    }

    function initMenu() {
        var addBtn = document.getElementById('add'),
            removeBtn = document.getElementById('remove'),
            drawBtn = document.getElementById('activity');

        addBtn.addEventListener('click', function() {
            controller.addSector();
        });

        removeBtn.addEventListener('click', function() {
            controller.removeSector();
        });

        drawBtn.addEventListener('click', function(event) {
            var node = event.target;
            if (node.tagName == 'IMG') {
                node = node.parentNode;
            }
            controller.addActivity(node.id);
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
            var pixel = bg_ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
            if (pane.style.cursor == 'pointer' && controller.isSelectable(pixel)) {
                controller.selectSector(event.offsetX, event.offsetY);
            }
        });

        pane.addEventListener('mousedown', function (event) {
            mousedown = true;
            controller.activateMove(event.offsetX, event.offsetY);
        });

        pane.addEventListener('mouseup', function () {
            mousedown = false;
            controller.deactivateMove();
        });

        pane.addEventListener('mousemove', function (event) {
            if (mousedown) {
                if (pane.style.cursor == 'move') {
                    if (allowToMove === true) {
                        controller.moveSector(event.offsetX, event.offsetY);
                        allowToMove = false;
                        setTimeout(function() {
                            allowToMove = true;
                        }, 200);
                    }
                }
            }
            else {
                var pixel = bg_ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
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

        window.onresize = function() {
            var pane = ctx.canvas,
                bg_pane = bg_ctx.canvas;

            pane.width = bg_pane.width = pane.parentElement.clientWidth;
            pane.height = bg_pane.height = pane.parentElement.clientHeight-55;

            ctx.strokeStyle = "#414A6B";
            ctx.lineWidth = 5;
            bg_ctx.lineWidth = 5;
            ctx.translate(pane.width / 2, pane.height / 2);
            bg_ctx.translate(pane.width / 2, pane.height / 2);
        };
    }

    init();
})();