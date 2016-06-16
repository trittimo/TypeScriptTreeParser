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
            this.kind = ts.syntaxKindToName(node.kind);
            this.start = node.pos;
            this.stop = node.end;
            this.children = [];
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
        }
        return FileNode;
    }(Node));
    Tree.FileNode = FileNode;
    var ModuleNode = (function (_super) {
        __extends(ModuleNode, _super);
        function ModuleNode(node) {
            _super.call(this, node);
            this.name = node.name.text;
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
        }
        return NamespaceNode;
    }(Node));
    Tree.NamespaceNode = NamespaceNode;
    var ClassNode = (function (_super) {
        __extends(ClassNode, _super);
        function ClassNode(node) {
            _super.call(this, node);
            this.name = node.name.text;
        }
        return ClassNode;
    }(Node));
    Tree.ClassNode = ClassNode;
    var InterfaceNode = (function (_super) {
        __extends(InterfaceNode, _super);
        function InterfaceNode(node) {
            _super.call(this, node);
            this.name = node.name.text;
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
            default:
                break;
        }
        if (node !== undefined) {
            node.parent = parent;
            if (parent !== null) {
                parent.children.push(node);
            }
        }
        sourceNode.getChildren().forEach(function (child) {
            buildSourceTree(child, node || parent);
        });
        return node;
    }
    Tree.buildSourceTree = buildSourceTree;
})(Tree || (Tree = {}));
function run() {
    var script = document.getElementById('scriptSource').value;
    var ntsTree = ts.createSourceFile('script.ts', script, ts.ScriptTarget.Latest, true);
    console.log(Tree.buildSourceTree(ntsTree, null));
}
