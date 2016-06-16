/// <reference path="ntypescript.d.ts" />
module Tree {
    export abstract class Node {
        source: ts.Node;
        kind: string;
        start: number;
        stop: number;
        children: Node[];
        parent: Node;
        name: string;
        qualifiedPath: string[];
        constructor(node: ts.Node) {
            this.source = node;
            this.kind = ts.syntaxKindToName(node.kind);
            this.start = node.pos;
            this.stop = node.end;
            this.children = [];
        }
    }
    export class FileNode extends Node {
        sourceFile: string;
        constructor(node: ts.SourceFile) {
            super(node);
            this.sourceFile = node.text;
            this.name = node.fileName;
        }
    }
    export class ModuleNode extends Node {
        constructor(node: ts.ModuleDeclaration) {
            super(node);
            this.name = node.name.text;
        }
    }
    export class NamespaceNode extends Node {
        // TODO
        constructor(node: ts.Node) {
            super(node);
            // this.name = node.name.text;
        }
    }
    export class ClassNode extends Node {
        constructor(node: ts.ClassDeclaration) {
            super(node);
            this.name = node.name.text;
        }
    }
    export class InterfaceNode extends Node {
        constructor(node: ts.InterfaceDeclaration) {
            super(node);
            this.name = node.name.text;
        }
    }
    export class MethodNode extends Node {
        // TODO
        constructor(node: ts.MethodDeclaration | ts.MethodSignature) {
            super(node);
            // this.name = node.name.getText();
        }
    }
    export class FieldNode extends Node {
        type: string;
        // TODO
        constructor(node: ts.VariableDeclaration | ts.PropertyDeclaration | ts.PropertySignature) {
            super(node);
            // this.name = node.name.text;
        }
    }

    export function buildSourceTree(sourceNode: ts.Node, parent: Node) : Node {
        let node: Node;
        switch(sourceNode.kind) {
            case ts.SyntaxKind.SourceFile:
            node = new FileNode(sourceNode as ts.SourceFile);
            break;
            case ts.SyntaxKind.ModuleDeclaration:
            node = new ModuleNode(sourceNode as ts.ModuleDeclaration);
            break;
            case ts.SyntaxKind.ClassDeclaration:
            node = new ClassNode(sourceNode as ts.ClassDeclaration);
            break;
            case ts.SyntaxKind.InterfaceDeclaration:
            node = new InterfaceNode(sourceNode as ts.InterfaceDeclaration);
            break;
            case ts.SyntaxKind.MethodDeclaration:
            node = new MethodNode(sourceNode as ts.MethodDeclaration);
            break;
            case ts.SyntaxKind.MethodSignature:
            node = new MethodNode(sourceNode as ts.MethodSignature);
            break;
            case ts.SyntaxKind.VariableDeclaration:
            node = new FieldNode(sourceNode as ts.VariableDeclaration); 
            break;
            case ts.SyntaxKind.PropertyDeclaration:
            node = new FieldNode(sourceNode as ts.PropertyDeclaration);
            break;
            case ts.SyntaxKind.PropertySignature:
            node = new FieldNode(sourceNode as ts.PropertySignature);
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
        sourceNode.getChildren().forEach(child => {
            buildSourceTree(child, node || parent);
        });
        return node;
    }
}

function run() {
    var script = (<any>document.getElementById('scriptSource')).value;
    let ntsTree: ts.SourceFile = ts.createSourceFile('script.ts', script, ts.ScriptTarget.Latest, true);
    console.log(Tree.buildSourceTree(ntsTree, null));
}