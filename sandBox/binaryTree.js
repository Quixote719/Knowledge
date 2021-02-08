let Node = function (id) {
  this.id = id;
  this.left = null;
  this.right = null;
};

let BinaryTree = function () {
  this.rootNode = null;
  this.addNode = (key) => {
    if (this.rootNode === null) {
      this.rootNode = new Node(key);
    } else {
      insertNode(this.rootNode, key);
    }
  };
  this.findMin = () => {
    if (!this.rootNode) {
      return null;
    }
    let target = this.rootNode;
    while (target.left) {
      target = target.left;
    }
    return target;
  };
  this.findMax = () => {
    if (!this.rootNode) {
      return null;
    }
    let target = this.rootNode;
    while (target.right) {
      target = target.right;
    }
    return target;
  };
  this.removeNode = (key) => {
    if (this.rootNode === null) {
      return;
    }
    this.rootNode = deleteNode(this.rootNode, key);
  };
};

insertNode = (node, key) => {
  if (!node) return;
  if (node.id < key) {
    if (node.right === null) {
      node.right = new Node(key);
    } else {
      insertNode(node.right, key);
    }
  } else {
    if (node.left === null) {
      node.left = new Node(key);
    } else {
      insertNode(node.left, key);
    }
  }
};

deleteNode = (node, key) => {
  if (!node) return;
  if (node.id === key) {
    node = null;
  } else if (node.id > key) {
    if (node.left && node.left.id === key) {
      node.left = null;
    } else {
      deleteNode(node.left, key);
    }
  } else {
    if (node.right && node.right.id === key) {
      node.right = null;
    } else {
      deleteNode(node.right, key);
    }
  }
  return node;
};

let bt1 = new BinaryTree();
bt1.addNode(12);
bt1.addNode(8);
bt1.addNode(7);
bt1.addNode(15);
bt1.addNode(6);
console.warn(bt1, bt1.rootNode);
bt1.removeNode(6);
bt1.removeNode(7);
console.warn("rootNode", bt1.rootNode, bt1.rootNode.left);
console.warn(bt1.findMin());
console.warn(bt1.findMax());
