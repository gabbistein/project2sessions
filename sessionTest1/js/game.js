/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

function getRandomImage() {
    var arrayImg = new Array();
    arrayImg[0] = "chefChop.png";
    arrayImg[1] = "chefKebab.png";
    arrayImg[2] = "chefQuit.png";
    arrayImg[3] = "chefServe.png";
    arrayImg[4] = "chefStand.png";
    arrayImg[5] = "sprite.png";

    callRandomImage(arrayImg);

    function callRandomImage(imgAr, path) {
        path = path || "assets/sprites/"; // default path here
        var num = Math.floor(Math.random() * imgAr.length);
        var img = imgAr[num];
        var imgStr = path + img;
        var sprite = imgStr;
        // console.log(sprite);
        game.load.image("sprite", sprite);
    };
};

Game.preload = function () {
    game.load.tilemap("map", "assets/map/construction.png");
    getRandomImage(game.load.image.sprite);
};

Game.create = function () {
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    var map = game.add.tilemap("map");
    var layer;
    // i don't know where the plural layers comes from, but it breaks without
    for (var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
};

Game.getCoordinates = function (layer, pointer) {
    Client.sendClick(pointer.worldX, pointer.worldY);
};

Game.addNewPlayer = function (id, x, y) {
    Game.playerMap[id] = game.add.sprite(x, y, "sprite");
};

Game.movePlayer = function (id, x, y) {
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x, player.y, x, y);
    var tween = game.add.tween(player);
    var duration = distance * 10;
    tween.to({ x: x, y: y }, duration);
    tween.start();
};

Game.removePlayer = function (id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};