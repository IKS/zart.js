// File:   Namespaces.js
// Author: <a href="mailto:sebastian.germesin@dfki.de">Sebastian Germesin</a>
//

Zart.prototype.Namespaces = function (base, namespaces) {
    
    if (!base) {
        throw "Please provide a base namespace!";
    }
    
    this._base = base;
    this.base = function (ns) {
        if (!ns) { // getter
            return this._base;
        } else if (typeof ns === "string") { // setter
            this._base = ns;
        } else {
            throw "Please provide a valid namespace!";
        }
        return this;
    };
    
    this._namespaces = (namespaces)? namespaces : {};
        
    this.add = function (k, v) {
        if (typeof k === "object") {
            for (var k1 in k) {
                this.add(k1, k[k1]);
            }
            return this;
        }
        if (k === "") {
            this.base(v);
        }
        //check if we overwrite existing mappings
        else if (this.containsKey(k) && v !== this._namespaces[k]) {
            throw "ERROR: Trying to register namespace prefix mapping (" + k + "," + v + ")!" +
                  "There is already a mapping existing: '(" + k + "," + this.get(k) + ")'!";
        } else {
            jQuery.each(this._namespaces, function (k1,v1) {
                if (v1 === v && k1 !== k) {
                    throw "ERROR: Trying to register namespace prefix mapping (" + k + "," + v + ")!" +
                          "There is already a mapping existing: '(" + k1 + "," + v + ")'!";
                }
            });
        }
        this._namespaces[k] = v;
        
        return this;
    };
    
    this.addOrReplace = function (k, v) {
        if (typeof k === "object") {
            for (var k1 in k) {
                this.addOrReplace(k1, k[k1]);
            }
            return this;
        }
        var self = this;
        //check if we overwrite existing mappings
        if (this.containsKey(k) && v !== this._namespaces[k]) {
            this.remove(k);
        } else {
            jQuery.each(this._namespaces, function (k1,v1) {
                if (v1 === v && k1 !== k) {
                    self.remove(k1);
                }
            });
        }
        return this.add(k, v);
    };
    
    this.get = function (k) {
        return this._namespaces[k];
    };
    
    this.getFromValue = function (v) {
        jQuery.each(this._namespaces, function (k1,v1) {
            if (v1 === v) {
                return k1;
            }
        });
        throw "No key found that matches " + v + ".";
    };
    
    this.containsKey = function (k) {
        return (k in this._namespaces);
    };
    
    this.containsValue = function (v) {
        jQuery.each(this._namespaces, function (k1,v1) {
            if (v1 === v) {
                return true;
            }
        });
        return false;
    };

	this.update = function (k, v) {
        this._namespaces[k] = v;
        return this;
    };
    
    this.remove = function (k) {
        delete this._namespaces[k];
        return this;
    };
    
    this.toObj = function () {
        return jQuery.extend({'' : this._base}, this._namespaces);
    };
    
    this.curie = function(uri, safe){
        return Zart.Util.toCurie(uri, safe, this);
    };
    
    this.isCurie = Zart.Util.isCurie;
    
    this.uri = function (curie) {
        return Zart.Util.toUri (curie, this);
    };
    
    this.isUri = Zart.Util.isUri;
};