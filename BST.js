class TNode {
    value;
    leftNode;
    rightNode;
    constructor(val) {
        this.value = val;
        this.leftNode = null;
        this.rightNode = null;
    }
}

class Tree {
  #root = null;
  constructor(array) {
    this.#root = this.#buildTree(array);
  }
  #sortAndRemoveDuplicates = (array) => {
    array.sort((a, b) => a - b);
    array = [...new Set(array)];
    return array;
  };

  #buildTree = (array) => {
    let cleanedArray = this.#sortAndRemoveDuplicates(array);
    const construct = (arr, start, end) => {
      if (start > end) return null;
      const middle = parseInt((start + end) / 2);
      const rootNode = new TNode(arr[middle]);

      rootNode.leftNode = construct(arr, start, middle - 1);
      rootNode.rightNode = construct(arr, middle + 1, end);

      return rootNode;
    };
    return construct(cleanedArray, 0, cleanedArray.length - 1);
  };

  insert = (val, node = this.#root) => {
    const insertRec = (value, node) => {
        if (value == undefined) throw new Error("No arguments passed");
        if (node == null) return new TNode(value);
    
        if (value > node.value) {
          node.rightNode = insertRec(value, node.rightNode);
        } else if (value < node.value) {
          node.leftNode = insertRec(value, node.leftNode);
        }
        return node;
    }
    this.#root = insertRec(val, node);
  };

  find = (val) => {
    if (val == undefined || !Number.isInteger(val))
      throw new Error("Invalid argument passed");
    const search = (val, node) => {
      if (node === null) return null;
      if (node.value == val) return node;

      if (node.value < val) return search(val, node.rightNode);
      else if (node.value > val) return search(val, node.leftNode);
    };
    return search(val, this.#root);
  };

  levelOrder = (callback) => {
    const queue = [this.#root];
    const list = [];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node.leftNode !== null) queue.push(node.leftNode);
      if (node.rightNode !== null) queue.push(node.rightNode);

      if (callback) callback(node);
      else list.push(node.value);
    }
    if (!callback) return list;
  };

  inOrder = (callback) => {
    const list = [];
    const fn = (node) => {
      if (node == null) return;
      fn(node.leftNode);

      if (callback) callback(node);
      else list.push(node.value);

      fn(node.rightNode);
    };
    fn(this.#root);
    if (!callback) return list;
  };

  preOrder = (callback) => {
    const list = [];
    const fn = (node) => {
      if (node == null) return;

      if (callback) callback(node);
      else list.push(node.value);
      fn(node.leftNode);
      fn(node.rightNode);
    };
    fn(this.#root);
    if (!callback) return list;
  };

  postOrder = (callback) => {
    const list = [];
    const fn = (node) => {
      if (node == null) return;
      fn(node.leftNode);
      fn(node.rightNode);

      if (callback) callback(node);
      else list.push(node.value);
    };
    fn(this.#root);
    if (!callback) return list;
  };

  height = (node = this.#root) => {
    const sumEdges = (node) => {
      let edgeCount = [];

      if (node.leftNode == null || node.rightNode == null) {
        edgeCount = [0, 0];
      }
      if (node.leftNode !== null) {
        edgeCount[0] = sumEdges(node.leftNode)[0];
        edgeCount[0] += 1;
      }
      if (node.rightNode !== null) {
        edgeCount[1] = sumEdges(node.rightNode)[1];
        edgeCount[1] += 1;
      }
      return edgeCount;
    };
    let result = sumEdges(node);
    result.sort((a, b) => a - b);
    return result[1];
  };

  depth = (node) => {
    if (node == undefined) throw new Error("No arguments passed");
    const countEdges = (tnode) => {
      if (node === null) return null;
      if (node.value == tnode.value) return 0;

      if (node.value > tnode.value) {
        let count = countEdges(tnode.rightNode);
        if (count !== null) return 1 + count;
        else return null;
      } else if (node.value < tnode.value) {
        let count = countEdges(tnode.leftNode);
        if (count !== null) return 1 + count;
        else return null;
      }
    };
    return countEdges(this.#root);
  };
  isBalanced = () => {
    let balanced = true;
    const check = (node) => {
        let leftSubtree = node.leftNode;
        let rightSubtree = node.rightNode;

        if (leftSubtree !== null && rightSubtree !== null)
        {
            const leftSubtreeHeight = this.height(leftSubtree);
            const rightSubtreeHeight = this.height(rightSubtree);
            if (Math.abs(leftSubtreeHeight - rightSubtreeHeight) > 1) balanced = false;
        }
        if (leftSubtree) check(leftSubtree)
        if (rightSubtree) check(rightSubtree)
    }
    check(this.#root);
    return balanced;
  }
  rebalance = () => {
    const sortedList = this.inOrder();
    this.#root = this.#buildTree(sortedList);
  };
  delete = (val, root = this.#root) => {
    if (val == undefined) throw new Error("No arguments passed");
    const del = (node) => {
      if (node == null) return null;

      if (val < node.value) {
        node.leftNode = del(node.leftNode);
      }
      else if (val > node.value) {
        node.rightNode = del(node.rightNode);
      }

      if (node.value == val)
      {
        let leftNode = node.leftNode;
        let rightNode = node.rightNode;

        // NODE HAS NO CHILDREN
        if (leftNode == null && rightNode == null) {
          return null;
        }
        // NODE HAS ONE CHILD
        if (leftNode != null && rightNode == null) {
          return leftNode;
        }
        else if (leftNode == null && rightNode != null) {
          return rightNode;
        }

        // NODE HAS TWO CHILDREN
        if (leftNode != null && rightNode != null) {
          let successor = node.rightNode;
          let successorParent = node;
          // GET THE NEXT VALUE LARGER THAN THE NODE TO BE DELETED
          while (successor.leftNode != null) {
            successorParent = successor;
            successor = successor.leftNode;
          }

          if (successorParent != node)
          {
            successorParent.leftNode = successor.rightNode;
          } else {
            successorParent.rightNode = successor.rightNode;
          }
          node.value = successor.value;
          // return node;
        }
      }
      return node;
    };
    this.#root = del(root);
  };
}

let tree = new Tree([1,2,3,4,5,6,7]);
tree.insert(8);
tree.insert(9);
console.log(tree.inOrder())
console.log(tree.preOrder())
console.log(tree.postOrder())
console.log(tree.isBalanced())