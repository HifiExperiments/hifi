//
//  Page.js
//
//  Sam Gateau, created on 4/19/2019
//  Copyright 2019 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
"use strict";

(function() {
function Page(title, qmlurl, width, height, onViewCreated, onViewClosed) {
    this.title = title;
    this.qml = qmlurl;
    this.width = width;
    this.height = height;
    this.onViewCreated = onViewCreated;
    this.onViewClosed = onViewClosed;

    this.window;

    print("Page: New Page:" + JSON.stringify(this));
}

Page.prototype.killView = function () {
    print("Page: Kill window for page:" + JSON.stringify(this));
    if (this.window) { 
        print("Page: Kill window for page:" + this.title);
        //this.window.closed.disconnect(function () {
        //    this.killView();
        //});
        this.window.close();
        this.window = false;
    }
};

Page.prototype.createView = function () {
    var that = this;
    if (!this.window) {
        print("Page: New window for page:" + this.title);
        this.window = Desktop.createWindow(Script.resolvePath(this.qml), {
            title: this.title,
            presentationMode: Desktop.PresentationMode.NATIVE,
            size: {x: this.width, y: this.height}
        });
        this.onViewCreated(this.window);
        this.window.closed.connect(function () {
            that.killView();
            that.onViewClosed();
        });
    }  
};


Pages = function () {
    this._pages = {};
};

Pages.prototype.addPage = function (command, title, qmlurl, width, height, onViewCreated, onViewClosed) {
    if (onViewCreated === undefined) {
        // Workaround for bad linter
        onViewCreated = function(window) {};
    }
    if (onViewClosed === undefined) {
        // Workaround for bad linter
        onViewClosed = function() {};
    }
    this._pages[command] = new Page(title, qmlurl, width, height, onViewCreated, onViewClosed);
};

Pages.prototype.open = function (command) {
    print("Pages: command = " + command);
    if (!this._pages[command]) {
        print("Pages: unknown command = " + command);
        return;
    }
    this._pages[command].createView();
};

Pages.prototype.clear = function () {
    for (var p in this._pages) {
        print("Pages: kill page: " + p);
        this._pages[p].killView();
        delete this._pages[p];
    }
    this._pages = {};
};

}()); 
