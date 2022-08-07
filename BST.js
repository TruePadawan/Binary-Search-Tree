const sortAndRemoveDuplicates = array => {
    array.sort((a, b) => a - b);
    array = [...new Set(array)];
    return array;
}

const buildTree = (array) => {
    let cleanedArray = sortAndRemoveDuplicates(array);
    const construct = (arr, start, end) => {
        if (start > end) return null;
        const middle = parseInt((start+end)/2);
        const rootNode = new TNode(arr[middle]);

        rootNode.leftNode = construct(arr, start, middle-1);
        rootNode.rightNode = construct(arr, middle+1, end);

        return rootNode;
    }
    return construct(cleanedArray, 0, cleanedArray.length-1);
}

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
        this.#root = buildTree(array);
    }
    insert = (val, node = this.#root) => {
        if (val == undefined) throw new Error("No arguments passed");
        if (node == null) return new TNode(val);

        if (val > node.value)
        {
            node.rightNode = this.insert(val, node.rightNode);
        }
        else if (val < node.value)
        {
            node.leftNode = this.insert(val, node.leftNode);
        }
    }
    find = (val) => {
        if (val == undefined || !Number.isInteger(val)) throw new Error("Invalid argument passed");
        const search = (val, node) => {
            if (node === null) return null;
            if (node.value == val) return node;

            if (node.value < val) return search(val, node.rightNode)
            else if (node.value > val) return search(val, node.leftNode)
        }
        return search(val, this.#root);
    }
    levelOrder = (callback) => {
        const queue = [this.#root];
        const list = [];
        while(queue.length > 0)
        {
            const node = queue.shift();
            if (node.leftNode !== null) queue.push(node.leftNode)
            if (node.rightNode !== null) queue.push(node.rightNode)
            
            if (callback) callback(node)
            else list.push(node.value);
        }
        if (!callback) return list;
    }
    inOrder = (callback) => {
        const list = [];
        const fn = (node) => {
            if (node == null) return;
            fn(node.leftNode);

            if (callback) callback(node)
            else list.push(node.value);

            fn(node.rightNode);
        }
        fn(this.#root);
        if (!callback) return list;
    }
    preOrder = (callback) => {
        const list = [];
        const fn = (node) => {
            if (node == null) return;
            
            if (callback) callback(node)
            else list.push(node.value);
            fn(node.leftNode);
            fn(node.rightNode);
        }
        fn(this.#root);
        if (!callback) return list;
    }
    postOrder = (callback) => {
        const list = [];
        const fn = (node) => {
            if (node == null) return;
            fn(node.leftNode);
            fn(node.rightNode);

            if (callback) callback(node)
            else list.push(node.value);
        }
        fn(this.#root);
        if (!callback) return list;
    }
    height = (node = this.#root) => {
        const sumEdges = (node) => {
            let edgeCount = [];
            
            if (node.leftNode == null || node.rightNode)
            {
                edgeCount = [0, 0];
            }
            if (node.leftNode !== null) {
                edgeCount[0] = (sumEdges(node.leftNode, edgeCount))[0];
                edgeCount[0] += 1;
            }
            if (node.rightNode !== null) {
                edgeCount[1] = (sumEdges(node.rightNode, edgeCount))[1];
                edgeCount[1] += 1;
            }
            return edgeCount;
        }
        let result = sumEdges(node);
        result.sort((a, b) => a - b);
        return result[1];
    }
    delete = (val) => {

    }
}

let tree = new Tree([1,2,3,4,5,6,7,8]);
console.log(tree.inOrder())
console.log(tree.preOrder())
console.log(tree.postOrder())
console.log(tree.height())