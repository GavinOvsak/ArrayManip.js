// arrayManip.js
// v1.0
// Dependency-free library for turning common array manipulations into a readable single line of code with minimal nested parentheses.
// Created By: Gavin Ovsak. www.workbygavin.com

// ---- Code ----

var a = {
  version: '1.0'
};

var paramTransforms = ['prop', 'from', 'in', 'is', 'op', 'toArr', 'toObj'];
var noParamTransforms = ['not', 'index'];

var addTransforms = function(f, paramOnly) {
  // Allows chaining of wrapped functions

  paramTransforms.map(function(t) {
    f[t] = function() {
      var func = a[t].apply(this, arguments);
      return addTransforms(function(item, i, origItem) {
        return func(f(item, i, origItem), i, item);
      });
    };
  });

  if (paramOnly) return f;

  noParamTransforms.map(function(t) {
    f[t] = addTransforms(function(item, i, origItem) {
      return a[t](f(item, i, origItem), i, item);
    }, true);
  });

  return f;
};

// Transforms

a.prop = function(prop) {
  if (prop === '' || prop == null) return a.item;
  else return addTransforms(a.use(a.get, [null, prop]));
};

a.from = function(set) {
  return addTransforms(a.use(a.get, [set, null]));
};

a.in = function(set) {
  return addTransforms(function(item) {
    return Array.isArray(set) ? set.indexOf(item) >= 0 : set[item] != null;
  });
};

a.is = function(val) {
  return addTransforms(function(item) {
    return item == val;
  });
};

a.op = function(operator, num) {
  // In reductions (when num == null), item2 is the new item. In normal arrays, item2 is the index.
  return addTransforms(function(item, item2, origItem) {
    if (typeof num === 'function') var other = num(origItem);
    else if (num == null) var other = item2;
    else var other = num;

    if (operator == '>') {
      return item > other;
    } else if (operator == '>=') {
      return item >= other;
    } else if (operator == '<') {
      return item < other;
    } else if (operator == '<=') {
      return item <= other;
    } else if (operator == '==') {
      return item == other;
    } else if (operator == '!=') {
      return item != other;
    } else if (operator == '+') {
      return item + other;
    } else if (operator == '-') {
      return item - other;
    } else if (operator == '*') {
      return item * other;
    } else if (operator == '^') {
      return Math.pow(item, other);
    } else if (operator == '/') {
      return item / other;
    } else if (operator == 'abs') {
      return Math.abs(item);
    } else if (operator == 'min') {
      return Math.min(item, other);
    } else if (operator == 'max') {
      return Math.max(item, other);
    } else if (typeof operator === 'function') {
      return operator(item);
    }
  });
};

a.index = addTransforms(function(item, i) {
  return i;
});

a.not = addTransforms(function(item) {
  return !item;
});

a.toArr = function(fList) {
  return addTransforms(function(item, i) {
    return fList.map(function(func) {
      if (typeof func === 'function') return func(item, i);
      else if (func == null) return item;
      else return func;
    });
  });
};

a.toObj = function(map) {
  return addTransforms(function(item, i) {
    var res = {};
    for (var key in map) {
      if (typeof map[key] === 'function') res[key] = map[key](item, i);
      else if (map[key] == null) res[key] = item;
      else res[key] = map[key];
    }
    return res;
  });
};

// Sort

a.by = function(func, direction) {
  if (typeof func !== 'function') func = a.prop(func);
  func = func || a.item;
  direction = direction || 'inc';
  return function(a, b) {
    return (func == 'alpha' ? a.localeCompare(b) : (func(a) - func(b))) * (direction == 'inc' ? 1 : -1);
  };
}

// Reduce

a.minIndex = function(compare) {
  if (typeof compare === 'function') {
    return function(old_i, item, i, list) {
      if (i == 1) old_i = 0; // Old_i should always be 0 when i == 1
      if (list[old_i] == null || compare(item) < compare(list[old_i])) return i;
      return old_i;
    };
  } else {
    return a.minIndex(a.item).apply(this, arguments);
  }
};

// Conditionals

a.and = function() {
  var fList = [].slice.call(arguments);
  return addTransforms(function(item, i) {
    return fList.every(function(func) {
      return func(item, i);
    });
  });
};

a.or = function() {
  var fList = [].slice.call(arguments);
  return addTransforms(function(item, i) {
    return fList.some(function(func) {
      return func(item, i);
    });
  });
};

// Trivial function

a.item = function(item) {
  return item;
};

// Internal utility based on lodash.js _.get

a.get = function(obj, prop) {
  return (prop + '').split('.').reduce(function(start, nextPath) {
    return start[nextPath];
  }, obj);
};

// Extend other functions

a.use = function(func, args) {
  var itemIndex = args.indexOf(null);
  if (itemIndex == -1) itemIndex = args.length;
  return function(item) {
    var list = args.map(function(arg, i) {
      if (i == itemIndex) return item;
      return arg;
    });
    return func.apply(this, list);
  }
};
