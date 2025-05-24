class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const boards = document.getElementById("board");

for (let n = 0; n < 160; n++) {
  const empty = document.createElement("div");
  empty.className = "empty";

  const innerTile = document.createElement("div");
  innerTile.className = "inner-tile";

  const innerInnerTile = document.createElement("div");
  innerInnerTile.className = "inner-inner-tile";

  innerTile.appendChild(innerInnerTile);
  empty.appendChild(innerTile);
  boards.appendChild(empty);
}

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.paused = false;

    this.element = document.createElement("div");
    this.element.classList.add("block");

    const innerTile = document.createElement("div");
    innerTile.classList.add("inner-tile");

    const innerInnerTile = document.createElement("div");
    innerInnerTile.classList.add("inner-inner-tile");

    innerTile.appendChild(innerInnerTile);
    this.element.appendChild(innerTile);
  }

  init() {
    document.getElementById("board").appendChild(this.element);
  }

  render() {
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    this.element.style.left = `${this.y * width}px`;
    this.element.style.top = `${this.x * height}px`;
  }

  fall() {
    this.x += 1;
  }

  moveRight() {
    this.y += 1;
  }

  moveLeft() {
    this.y -= 1;
  }

  rightPosition() {
    return new Position(this.x, this.y + 1);
  }

  leftPosition() {
    return new Position(this.x, this.y - 1);
  }

  getPosition() {
    return new Position(this.x, this.y);
  }

  flash() {
    return window.animatelo?.flash(this.element, {
      duration: 500
    });
  }

  destroy() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }


  pause() {
    this.paused = true;
    this.element.classList.add("paused"); 
    
  }

  resume() {
    this.paused = false;
    this.element.classList.remove("paused");
  }

 
  togglePause() {
    this.paused ? this.resume() : this.pause();
  }
}

class Shape {
  constructor(blocks) {
    this.blocks = blocks;
  }

  getBlocks() {
    return [...this.blocks];
  }

  init() {
    this.blocks.forEach(block => block.init());
  }

  render() {
    this.blocks.forEach(block => block.render());
  }

  fallingPositions() {
    return this.blocks.map(b => {
      const { x, y } = b.getPosition();
      return new Position(x + 1, y);
    });
  }

  fall() {
    this.blocks.forEach(block => block.fall());
  }

  rightPositions() {
    return this.blocks.map(block => block.rightPosition());
  }

  leftPositions() {
    return this.blocks.map(block => block.leftPosition());
  }

  moveRight() {
    this.blocks.forEach(block => block.moveRight());
  }

  moveLeft() {
    this.blocks.forEach(block => block.moveLeft());
  }

  clear() {
    this.blocks.forEach(block => block.destroy());
    this.blocks = [];
  }

  addBlocks(newBlocks) {
    this.blocks.push(...newBlocks);
  }

  rotate() {
    // default: do nothing
  }

  rotatePositions() {
    // default: do nothing
    return [];
  }

   togglePause() {
    this.blocks.forEach(block => block.togglePause());
  }
}

// Square shape (doesn't rotate)
class Square extends Shape {
  constructor(x, y) {
    super([
      new Block(x, y),
      new Block(x, y + 1),
      new Block(x + 1, y),
      new Block(x + 1, y + 1)
    ]);
  }
}

// L Shape
class LShape extends Shape {
  constructor(x, y) {
    super([
      new Block(x, y),
      new Block(x - 1, y),
      new Block(x + 1, y),
      new Block(x + 1, y + 1)
    ]);
    this.position = 0;
  }

  rotate() {
    const rotated = this.rotatePositions().map(p => new Block(p.x, p.y));
    this.clear();
    this.addBlocks(rotated);
    this.position = this.getNextPosition();
  }

  rotatePositions() {
    const { x, y } = this.blocks[0].getPosition();
    switch (this.getNextPosition()) {
      case 0:
        return [
          new Position(x, y),
          new Position(x - 1, y),
          new Position(x + 1, y),
          new Position(x + 1, y + 1)
        ];
      case 1:
        return [
          new Position(x, y),
          new Position(x, y - 1),
          new Position(x, y + 1),
          new Position(x + 1, y - 1)
        ];
      case 2:
        return [
          new Position(x, y),
          new Position(x - 1, y - 1),
          new Position(x - 1, y),
          new Position(x + 1, y)
        ];
      case 3:
        return [
          new Position(x, y),
          new Position(x, y - 1),
          new Position(x, y + 1),
          new Position(x - 1, y + 1)
        ];
      default:
        return [];
    }
  }

  getNextPosition() {
    return (this.position + 1) % 4;
  }
}

// T Shape
class TShape extends Shape {
  constructor(x, y) {
    super([
      new Block(x, y),
      new Block(x, y - 1),
      new Block(x + 1, y),
      new Block(x, y + 1)
    ]);
    this.position = 0;
  }

  rotate() {
    const rotated = this.rotatePositions().map(p => new Block(p.x, p.y));
    this.clear();
    this.addBlocks(rotated);
    this.position = this.getNextPosition();
  }

  rotatePositions() {
    const { x, y } = this.blocks[0].getPosition();
    switch (this.getNextPosition()) {
      case 0:
        return [
          new Position(x, y),
          new Position(x, y - 1),
          new Position(x + 1, y),
          new Position(x, y + 1)
        ];
      case 1:
        return [
          new Position(x, y),
          new Position(x - 1, y),
          new Position(x, y - 1),
          new Position(x + 1, y)
        ];
      case 2:
        return [
          new Position(x, y),
          new Position(x, y - 1),
          new Position(x - 1, y),
          new Position(x, y + 1)
        ];
      case 3:
        return [
          new Position(x, y),
          new Position(x - 1, y),
          new Position(x, y + 1),
          new Position(x + 1, y)
        ];
      default:
        return [];
    }
  }

  getNextPosition() {
    return (this.position + 1) % 4;
  }
}

// Z Shape
class ZShape extends Shape {
  constructor(x, y) {
    super([
      new Block(x, y),
      new Block(x, y - 1),
      new Block(x + 1, y),
      new Block(x + 1, y + 1)
    ]);
    this.position = 0;
  }

  rotate() {
    const rotated = this.rotatePositions().map(p => new Block(p.x, p.y));
    this.clear();
    this.addBlocks(rotated);
    this.position = this.getNextPosition();
  }

  rotatePositions() {
    const { x, y } = this.blocks[0].getPosition();
    switch (this.getNextPosition()) {
      case 0:
        return [
          new Position(x, y),
          new Position(x, y - 1),
          new Position(x + 1, y),
          new Position(x + 1, y + 1)
        ];
      case 1:
        return [
          new Position(x, y),
          new Position(x - 1, y),
          new Position(x, y - 1),
          new Position(x + 1, y - 1)
        ];
      default:
        return [];
    }
  }

  getNextPosition() {
    return (this.position + 1) % 2;
  }
}

class Line extends Shape {
  constructor(x, y) {
    let blocks = [];
    blocks.push(new Block(x, y));
    blocks.push(new Block(x - 1, y));
    blocks.push(new Block(x + 1, y));
    blocks.push(new Block(x + 2, y));
    super(blocks);
    this.position = 0;
  }

  rotate() {
    let blocks = this.rotatePositions().map(p => new Block(p.x, p.y));
    this.clear();
    this.addBlocks(blocks);
    this.position = this.getNextPosition();
  }

  rotatePositions() {
    let pos = this.getBlocks()
      .shift()
      .getPosition();
    let x = pos.x;
    let y = pos.y;
    let positions = [];
    switch (this.getNextPosition()) {
      case 0:
        {
          positions.push(new Position(x, y));
          positions.push(new Position(x - 1, y));
          positions.push(new Position(x + 1, y));
          positions.push(new Position(x + 2, y));
        }
        break;
      case 1:
        {
          positions.push(new Position(x, y));
          positions.push(new Position(x, y - 1));
          positions.push(new Position(x, y + 1));
          positions.push(new Position(x, y + 2));
        }
        break;
    }
    return positions;
  }

  getNextPosition() {
    return (this.position + 1) % 2;
  }
}

class Board {
  constructor() {
    this.blocks = [];
    this.shapes = [];
    this.interval = undefined;
    this.loopInterval = 1000;
    this.loopIntervalFast = Math.floor(1000 / 27);
    this.score = 0;
    this.gameOver = true;
    this.paused = false;
    this.init();
  }

  setScore(value) {
    this.score = value;
    const scoreElement = document.querySelector("#score");
    if (scoreElement) scoreElement.textContent = this.score;
  }

  getScore() {
    return this.score;
  }

  init() {
    document.querySelectorAll(".empty").forEach((ele, index) => {
      const x = Math.floor(index / 10);
      const y = index % 10;
      ele.style.left = `${y * ele.offsetWidth}px`;
      ele.style.top = `${x * ele.offsetHeight}px`;
    });

    const message = document.querySelector("#message");
    if (message) message.textContent = "Tetris";

    // Assuming window.animatelo.flash is still required
    window.animatelo?.flash("#new-game", {
      duration: 2500,
      iterations: Infinity
    });
  }

 
  togglePause() {
    if (this.gameOver) return;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
      this.shapes.forEach(shape => shape.togglePause());
      this.blocks.forEach(block => block.pause?.());
        if (pauseIcon) pauseIcon.textContent = "▶";
    } else {
      this.initGameLoop(this.loopInterval);
      this.shapes.forEach(shape => shape.togglePause());
      this.blocks.forEach(block => block.resume?.());
      if (pauseIcon) pauseIcon.textContent = "⏸";
    }
  }

  newGame() {
    for (let shape of this.shapes) {
      this.removeShape(shape);
      this.addBlocks(shape.getBlocks());
    }

    for (let block of this.blocks) {
      block.destroy();
    }

    this.blocks = [];
    this.gameOver = false;
    this.initGameLoop(this.loopInterval);
    this.setScore(0);

    const banner = document.querySelector("#banner");
    if (banner) banner.style.display = "none";
  }

  initGameLoop(interval) {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.gameLoop(), interval);
  }

  gameLoop() {
    if (this.paused || this.gameOver) return;
    this.renderShapes();
    this.renderBlocks();
    this.spawnShapes();
    this.gameUpdate();
    console.log("Shapes Length:", this.shapes.length);
    console.log("Blocks Length:", this.blocks.length);
  }

  gameUpdate() {
    if (this.isGameOver()) {
      this.gameOver = true;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
      }

      const banner = document.querySelector("#banner");
      const message = document.querySelector("#message");
      const newGame = document.querySelector("#new-game");

      if (banner) banner.style.display = "block";
      if (message) message.textContent = "Game Over!";
      if (newGame) newGame.textContent = "Tap here to start again!";
    }
  }

  isGameOver() {
    return this.blocks.some(block => {
      const pos = block.getPosition();
      return pos.x === 0 && pos.y === 4;
    });
  }

  renderShapes() {
    for (let shape of this.getShapes()) {
      const falling = shape.fallingPositions();
      if (
        this.arePositonsWithinBoard(falling) &&
        this.areBlocksEmpty(falling)
      ) {
        shape.fall();
        shape.render();
      } else {
        this.removeShape(shape);
        this.addBlocks(shape.getBlocks());
        if (this.moveFast) {
          this.initGameLoop(this.loopInterval);
          this.moveFast = false;
        }
      }
    }
  }

  dropShape() {
    if (!this.gameOver) {
      this.initGameLoop(this.loopIntervalFast);
      this.moveFast = true;
    }
  }

  renderBlocks() {
    for (let x = 0; x < 16; x++) {
      const blocks = [];
      for (let y = 0; y < 10; y++) {
        const block = this.getBlock(x, y);
        if (!block) break;
        blocks.push(block);
      }
      if (blocks.length === 10) {
        this.removeBlocks(blocks);
        this.flashBlocks(blocks, () => {
          this.destroyBlocks(blocks);
          this.fallBlocks(x);
          this.setScore(this.getScore() + 10);
        });
      }
    }
  }

  flashBlocks(blocks, callback) {
    const anims = blocks.map(block => block.flash());
    if (anims.length > 0 && anims[0]?.[0]?.onfinish !== undefined) {
      anims[0][0].onfinish = callback;
    } else {
      // Fallback in case no animation API is supported
      setTimeout(callback, 300);
    }
  }

  fallBlocks(row) {
    for (let x = 0; x < row; x++) {
      for (let y = 0; y < 10; y++) {
        const block = this.getBlock(x, y);
        if (block) {
          block.fall();
          block.render();
        }
      }
    }
  }

  removeBlocks(blocks) {
    for (let block of blocks) {
      const index = this.blocks.indexOf(block);
      if (index !== -1) this.blocks.splice(index, 1);
    }
  }

  destroyBlocks(blocks) {
    for (let block of blocks) {
      block.destroy();
    }
  }

  getBlock(x, y) {
    return this.blocks.find(block => block.x === x && block.y === y);
  }

  spawnShapes() {
    if (this.shapes.length === 0) {
      let shape;
      switch (this.getRandomRange(0, 4)) {
        case 0:
          shape = new Line(0, 4);
          break;
        case 1:
          shape = new Square(0, 4);
          break;
        case 2:
          shape = new LShape(0, 4);
          break;
        case 3:
          shape = new ZShape(0, 4);
          break;
        case 4:
          shape = new TShape(0, 4);
          break;
      }

      shape.init();
      shape.render();
      this.shapes.push(shape);
    }
  }

  getShapes() {
    return [...this.shapes];
  }

  removeShape(shape) {
    const index = this.shapes.indexOf(shape);
    if (index !== -1) this.shapes.splice(index, 1);
  }

  addBlocks(blocks) {
    this.blocks.push(...blocks);
  }

  arePositonsWithinBoard(positions) {
    return positions.every(pos => pos.x < 16 && pos.y >= 0 && pos.y < 10);
  }

  areBlocksEmpty(positions) {
    return positions.every(pos =>
      this.blocks.every(block => {
        const blockPos = block.getPosition();
        return !(blockPos.x === pos.x && blockPos.y === pos.y);
      })
    );
  }

  leftKeyPress() {
    if (this.paused || this.gameOver) return;
    for (let shape of this.shapes) {
      const positions = shape.leftPositions();
      if (
        this.arePositonsWithinBoard(positions) &&
        this.areBlocksEmpty(positions)
      ) {
        shape.moveLeft();
        shape.render();
      }
    }
  }

  rightKeyPress() {
    if (this.paused || this.gameOver) return;
    for (let shape of this.shapes) {
      const positions = shape.rightPositions();
      if (
        this.arePositonsWithinBoard(positions) &&
        this.areBlocksEmpty(positions)
      ) {
        shape.moveRight();
        shape.render();
      }
    }
  }

  rotate() {
    if (this.paused || this.gameOver) return;
    for (let shape of this.shapes) {
      const positions = shape.rotatePositions();
      if (
        this.arePositonsWithinBoard(positions) &&
        this.areBlocksEmpty(positions)
      ) {
        shape.rotate();
        shape.init();
        shape.render();
      }
    }
  }

  upKeyPress() {
    this.rotate();
  }

  downKeyPress() {
    if (this.paused || this.gameOver) return;
    this.dropShape();
  }

  getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
const board = new Board();

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      board.leftKeyPress();
      break;

    case "ArrowUp":
      board.upKeyPress();
      break;

    case "ArrowRight":
      board.rightKeyPress();
      break;

    case "ArrowDown":
      board.downKeyPress();
      break;

    case " ":
      board.togglePause();
      break;
    case "n":
    case "N":
      board.newGame();
      break;

    default:
      console.log(`Unhandled key: ${e.key} (${e.code})`);
      break;
  }

  e.preventDefault(); // Prevent scrolling or default behavior
});

// Button click handlers
document.getElementById("new-game").addEventListener("click", () => {
  board.newGame();
});

document.getElementById("down").addEventListener("click", () => {
  board.downKeyPress();
});

document.getElementById("rotate").addEventListener("click", () => {
  board.upKeyPress();
});

document.getElementById("left").addEventListener("click", () => {
  board.leftKeyPress();
});

document.getElementById("right").addEventListener("click", () => {
  board.rightKeyPress();
});

document.getElementById("pause").addEventListener("click", () => {
    board.togglePause();
});