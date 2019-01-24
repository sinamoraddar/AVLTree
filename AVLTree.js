

AVLTree = (function () {
//pointer object will be used for remove method functionalities
    function Pointer(setter, getter) {
        this.Set = setter;
        this.Get = getter;
    };
//node constructor
    function Node() {
        this.Value = null;
        this.Left = null;
        this.Right = null;
        this.Height = 0;
    };
//root constructor
    function AVLTree() {
        this.Root = null;
    };
//set the balance field of each node based on the difference between the height of its left and right children
    Node.prototype.GetBalanceFactor = function () {
        return (this.Left == null ? -1 : this.Left.Height) -
               (this.Right == null ? -1 : this.Right.Height);
    };
//determine if the tree needs rotation based on its balance factor
    AVLTree.prototype.Balance = function (node) {
        var factor = node.GetBalanceFactor();
        if (factor == 2) {
            if (node.Left.GetBalanceFactor() == -1)
                this.RotateLeft(node.Left);

            this.RotateRight(node);
        } else if (factor == -2) {
            if (node.Right.GetBalanceFactor() == 1)
                this.RotateRight(node.Right);

            this.RotateLeft(node);
        }
    };

   
//roatate right method
    AVLTree.prototype.RotateRight = function (root) {
        var pivot = root.Left;

        var oldRootValue = root.Value;
        var oldRootRight = root.Right;

        root.Value = pivot.Value;
        root.Left = pivot.Left;
        root.Right = pivot;

        pivot.Value = oldRootValue;
        pivot.Left = pivot.Right;
        pivot.Right = oldRootRight;

    };
//rotate left method
    AVLTree.prototype.RotateLeft = function (root) {
        var pivot = root.Right;

        var oldRootValue = root.Value;
        var oldRootLeft = root.Left;

        root.Value = pivot.Value;
        root.Right = pivot.Right;
        root.Left = pivot;

        pivot.Value = oldRootValue;
        pivot.Right = pivot.Left;
        pivot.Left = oldRootLeft;

        
    };

    AVLTree.prototype.Draw = function (canvasId) {

        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext("2d");
        context.textAlign = "center";
//create a white rectangle starting from the top-left corner of the screen 
//based on the width and height of the canvas element
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (this.Root == null)
            return;

        var maxNodes = this.Root.Height == 0 ? 1 : Math.pow(2, this.Root.Height);

        var baseWidth = maxNodes * (60);

        var counter = 0;
        var currentDepth = 0;
        var baseNodeWidth = baseWidth;
        var y = 55;
        var x = ((canvas.width - baseWidth) / 2) + (baseNodeWidth / 2);
//storing tree elements in a queue
        var queue = [this.Root];

        while (queue.length > 0) {
            var currentNode = queue.shift();
            counter++;
//add node's left and right children to the queue if the height of the tree is more than one
            if ((currentDepth + 1) <= this.Root.Height) {
                queue.push(currentNode == null ? null : currentNode.Left);
                queue.push(currentNode == null ? null : currentNode.Right);
            }
//if the currentnode is not null draw it
            if (currentNode != null) {
                context.beginPath();
                context.arc(x, y - 5, 15, 0, 2 * Math.PI, false);
                context.fillStyle = 'green';
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = '#003300';
                context.stroke();
//draw lines to children nodes if height is above one
//if counter is odd draw a line to the right node
//if counter is even draw a line to the left node
                if (currentDepth > 0) {
                    context.beginPath();
                    context.moveTo(x, y - 20);

                    if (counter % 2 == 0)
                        context.lineTo(x - baseNodeWidth / 2, y - 45);
                    else
                        context.lineTo(x + baseNodeWidth / 2, y - 45); 

                    context.stroke();
                }
//if everything is fine fill the whole canvas
                context.fillStyle = 'white';
                context.font = "14px Consolas";
                context.fillText(currentNode.Value, x, y);

                context.font = "12px Consolas";
                context.fillStyle = 'black';
                //show the height factor at the topright corner
                context.fillText(currentNode.Height, x + 25, y - 11);
                context.fillStyle = 'red';
                //show the balance at the topleft corner
                context.fillText(currentNode.GetBalanceFactor(), x + 25, y + 2);
            }
//set the width of the tree based on the basenodewidth variabale
            x += baseNodeWidth;
//calvulate the number of the nodes on the current level based on the currentdepth
            var levelNodes = currentDepth == 0 ? 1 : Math.pow(2, currentDepth);
//when you've reached at the end of the current base set the counter to zero
            if (counter >= levelNodes) {
                counter = 0;
                currentDepth++;
                baseNodeWidth = baseWidth / Math.pow(2, currentDepth);
                y += 55;
                x = ((canvas.width - baseWidth) / 2) + (baseNodeWidth / 2);
            }
        }
    };
//search for the value via binary search
    AVLTree.prototype.FindValue = function (value) {
        var node = this.Root;
        while (node != null) {
            if (node.Value == value)
                return true;
            else if (node.Value > value)
                node = node.Left;
            else
                node = node.Right;
        }
        return false;
    };
//addvalue method checks if the root is null or not 
//and then passes root and value to add method to perform adding actions on the tree
    AVLTree.prototype.AddValue = function (value) {
        if (this.Root == null)
            this.Root = new Node();

        this.Add(this.Root, value);
    };
//add value for adding actions
    AVLTree.prototype.Add = function (node, value) {
//set the current value as root if the root is null
        if (node.Value == null) {
            node.Value = value;
            return 0;
        }
//if the value is smaller than the root
        if (node.Value > value) {
            //if root has no left child
            if (node.Left == null)
                node.Left = new Node();
            node.Height = Math.max(this.Add(node.Left, value) + 1, node.Height);
        } 
        //if root has no right child
        else if (node.Value < value) {
            if (node.Right == null)
                node.Right = new Node();
            node.Height = Math.max(this.Add(node.Right, value) + 1, node.Height);
        }

        this.Balance(node);

        return node.Height;

    };
//set a pointer to maintain the roor of the tree 
//send the pointer to remove method to perform remove fuctionality on the tree
    AVLTree.prototype.RemoveValue = function (value) {
        var currentObject = this;
        var ptr = new Pointer(
            function (v) { currentObject.Root = v; },
            function () { return currentObject.Root; }
        );

        return this.Remove(ptr, value);
    };
//remove method based on different conditions
    AVLTree.prototype.Remove = function (ptr, value) {
        var node = ptr.Get();
//if the root is null then just return -1
        if (node == null)
            return -1;
//if the desired value matches the root value
        if (node.Value == value) {
            //if root node has got no children
            if (node.Left == null && node.Right == null) { 
                ptr.Set(null);
                return -1;
            } 
            //if root node has got both right and left children
            else if (node.Left != null && node.Right != null) { 
                //take the most right chlid of the left child of the root node
                var dirNode = node.Left;
                while (dirNode.Right != null) {
                    dirNode = dirNode.Right;
                }
                //remove the most right node
                this.RemoveValue(dirNode.Value);
                //replace root node with the most right child of its left child
                node.Value = dirNode.Value;

                return node.Height;
            } 
            //if root node is only missing its right chlid
            else if (node.Left != null) {
                ptr.Set(node.Left);
                return node.Left.Height;
            } 
            //if root node is only missing its left chlid
            else { 
                ptr.Set(node.Right);
                return node.Right.Height;
            }
        }
//if desired value is smaller than the root value
        else if (node.Value > value) {
//set the pointer to the left child
            var lPtr = new Pointer(
                function (v) { node.Left = v; },
                function () { return node.Left; }
            );
//make a recursive call to the remove method
            var newHeight = this.Remove(lPtr, value);
            node.Height = Math.max(newHeight, node.Right == null ? -1 : node.Right.Height) + 1;
        }
//if desired value is larger than the root value
        else {
//set the pointer to the right child
            var rPtr = new Pointer(
                function (v) { node.Right = v; },
                function () { return node.Right; }
            );
//make a recursive call to the remove method
            var newHeight = this.Remove(rPtr, value);
            node.Height = Math.max(newHeight, node.Left == null ? -1 : node.Left.Height) + 1;
        }
//send the root node to the balance method to rebalance the tree
        this.Balance(node);

        return node.Height;
    };

    return AVLTree;

})();


(function ($) {

            var tree = new AVLTree();

            var getValue = function () {
                var $txtValue = $("#txtValue");
                var value = $txtValue.val();
                if ($.isNumeric(value)) {
                    $txtValue.val("");
                    return parseInt(value);
                }
                return null;
            };

            var addValueToTree = function() {
                var value = getValue();
                if (value != null) {
                    tree.AddValue(value);
                    tree.Draw("myTree");
                }
            };

            var findValueInTree = function () {
                var value = getValue();
                if (value != null) {
                    if (tree.FindValue(value))
                        alert(`Node ${value} Was found successfully!`);
                    else
                        alert("Not found!");
                }
            };

            var removeValueFromTree = function () {
                var value = getValue();
                if (value != null) {
                    tree.RemoveValue(value);
                    tree.Draw("myTree");
                }
            };

            $(document).ready(function () {
                $("#btnInsert").click(addValueToTree);
                $("#btnFind").click(findValueInTree);
                $("#btnRemove").click(removeValueFromTree);
            });

        })(jQuery);