var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="ntypescript.d.ts" />
var Tree;
(function (Tree) {
    var Node = (function () {
        function Node(node) {
            this.source = node;
            this.start = node.pos;
            this.stop = node.end;
            this.children = [];
            this.qualifiedPath = [];
        }
        return Node;
    }());
    Tree.Node = Node;
    var FileNode = (function (_super) {
        __extends(FileNode, _super);
        function FileNode(node) {
            _super.call(this, node);
            this.sourceFile = node.text;
            this.name = node.fileName;
            this.kind = "FileNode";
            this.qualifiedPath.push(node.fileName.substr(0, node.fileName.indexOf(".")));
        }
        return FileNode;
    }(Node));
    Tree.FileNode = FileNode;
    var ModuleNode = (function (_super) {
        __extends(ModuleNode, _super);
        function ModuleNode(node) {
            _super.call(this, node);
            this.name = node.name.text;
            this.kind = "ModuleNode";
        }
        return ModuleNode;
    }(Node));
    Tree.ModuleNode = ModuleNode;
    var NamespaceNode = (function (_super) {
        __extends(NamespaceNode, _super);
        // TODO
        function NamespaceNode(node) {
            _super.call(this, node);
            // this.name = node.name.text;
            this.kind = "NamespaceNode";
        }
        return NamespaceNode;
    }(Node));
    Tree.NamespaceNode = NamespaceNode;
    var ClassNode = (function (_super) {
        __extends(ClassNode, _super);
        function ClassNode(node) {
            _super.call(this, node);
            this.name = node.name.text;
            this.kind = "ClassNode";
        }
        return ClassNode;
    }(Node));
    Tree.ClassNode = ClassNode;
    var InterfaceNode = (function (_super) {
        __extends(InterfaceNode, _super);
        function InterfaceNode(node) {
            _super.call(this, node);
            this.name = node.name.text;
            this.kind = "InterfaceNode";
        }
        return InterfaceNode;
    }(Node));
    Tree.InterfaceNode = InterfaceNode;
    var MethodNode = (function (_super) {
        __extends(MethodNode, _super);
        // TODO
        function MethodNode(node) {
            _super.call(this, node);
            // this.name = node.name.getText();
            this.kind = "MethodNode";
        }
        return MethodNode;
    }(Node));
    Tree.MethodNode = MethodNode;
    var FieldNode = (function (_super) {
        __extends(FieldNode, _super);
        // TODO
        function FieldNode(node) {
            _super.call(this, node);
            // this.name = node.name.text;
            this.kind = "FieldNode";
        }
        return FieldNode;
    }(Node));
    Tree.FieldNode = FieldNode;
    function buildSourceTree(sourceNode, parent) {
        var node;
        switch (sourceNode.kind) {
            case ts.SyntaxKind.SourceFile:
                node = new FileNode(sourceNode);
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                node = new ModuleNode(sourceNode);
                break;
            case ts.SyntaxKind.ClassDeclaration:
                node = new ClassNode(sourceNode);
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                node = new InterfaceNode(sourceNode);
                break;
            case ts.SyntaxKind.MethodDeclaration:
                node = new MethodNode(sourceNode);
                break;
            case ts.SyntaxKind.MethodSignature:
                node = new MethodNode(sourceNode);
                break;
            case ts.SyntaxKind.VariableDeclaration:
                node = new FieldNode(sourceNode);
                break;
            case ts.SyntaxKind.PropertyDeclaration:
                node = new FieldNode(sourceNode);
                break;
            case ts.SyntaxKind.PropertySignature:
                node = new FieldNode(sourceNode);
                break;
            case ts.SyntaxKind.Identifier:
                //let node: ts.Identifier = sourceNode as ts.Identifier;
                break;
            default:
                break;
        }
        if (node !== undefined) {
            node.parent = parent;
            if (parent !== null) {
                parent.children.push(node);
                node.qualifiedPath = parent.qualifiedPath.concat([node.name]);
            }
        }
        sourceNode.getChildren().forEach(function (child) {
            buildSourceTree(child, node || parent);
        });
        return node;
    }
    Tree.buildSourceTree = buildSourceTree;
    function logSourceTree(node, depth) {
        if (depth === void 0) { depth = 0; }
        if (node.name) {
            console.log(Array(depth + 1).join(" "), ts.syntaxKindToName(node.kind), "::", node.name.text, "::");
        }
        else if (node.kind === ts.SyntaxKind.Identifier) {
            console.log(Array(depth + 1).join(" "), ts.syntaxKindToName(node.kind), "--", node.text, "--");
        }
        else {
            console.log(Array(depth + 1).join(" "), ts.syntaxKindToName(node.kind));
        }
        node.getChildren().forEach(function (child) {
            if (typeof (child) !== "string")
                logSourceTree(child, depth + 1);
        });
    }
    Tree.logSourceTree = logSourceTree;
})(Tree || (Tree = {}));
function run() {
    var script = document.getElementById('scriptSource').value;
    var ntsTree = ts.createSourceFile('script.ts', script, ts.ScriptTarget.Latest, true);
    console.log(Tree.buildSourceTree(ntsTree, null));
    // Tree.logSourceTree(ntsTree);
}
