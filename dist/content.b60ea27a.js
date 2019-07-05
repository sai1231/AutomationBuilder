// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"content.js":[function(require,module,exports) {
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  var attrName;
  var attrValueName;
  var implicitNavigationThreshold; // in ms

  var eventNamespace = 'gherkin-scenario-builder';
  var listeners = [];
  var isActive = false;
  var isRecording = false;
  var rawPages = '';
  var pages = {};
  var rawUsers = '';
  var users = {};
  var rawSteps = '';
  var stepTemplates = [];
  var steps = new Steps(stepTemplates);
  var isElemPickerActive = false;
  var isCollapsed = false;
  var featureName = 'Example';
  var scenarioName = 'Example';
  var lastUserInteractionTime = Date.now();
  var $iframeBody = Boundary.createBox('gherkin-scenario-builder');
  var $iframe = $('#gherkin-scenario-builder');
  $iframe.addClass('--gherkin-scenario-builder hidden');
  Boundary.loadBoxJS('#gherkin-scenario-builder', chrome.extension.getURL('vendor/iframeResizer.contentWindow.min.js'));
  Boundary.loadBoxCSS('#gherkin-scenario-builder', chrome.extension.getURL('vendor/fonts.css'));
  Boundary.loadBoxCSS('#gherkin-scenario-builder', chrome.extension.getURL('vendor/icons.css'));
  Boundary.loadBoxCSS('#gherkin-scenario-builder', chrome.extension.getURL('src/content.css'));
  var $elementLabel = $('<div />').addClass('--gherkin-scenario-builder-element-label').appendTo(document.body);
  var $container = $('<div />').addClass('container').appendTo($iframeBody);
  var $stepsWrapper = $('<div />').addClass('steps-wrapper').appendTo($container);
  var $stepsText = $('<textarea />').addClass('steps-text').prop('readonly', true).appendTo($stepsWrapper);
  $stepsWrapper.append('<h2 class="steps-heading">Scenario</h2>');
  var $steps = $('<div />').addClass('steps hidden').appendTo($stepsWrapper);
  $container.on('click', '.js-pick-element', function pickElement() {
    var $pickElemButton = $(this);
    var stepId = $pickElemButton.attr('data-step-id');

    var setClasses = function setClasses() {
      $(document).find('body').toggleClass('--gherkin-scenario-builder-show-elements', isElemPickerActive);
      $iframeBody.toggleClass('-picking-element', isElemPickerActive);
      $pickElemButton.toggleClass('-picking-element', isElemPickerActive);
      $pickElemButton.closest('.step').toggleClass('-picking-element', isElemPickerActive);
    };

    var hideElementLabel = function hideElementLabel() {
      return $elementLabel.css({
        display: 'none'
      });
    };

    var clickEventListener = function clickEventListener(event) {
      var _this = this;

      var $selectableChildren = $(this).find("[".concat(attrName, "]"));
      var wasChildClicked = $selectableChildren.filter(function () {
        return $.contains(_this, event.target);
      }).length > 0;

      if (wasChildClicked) {
        // Allows this click to pass through to the nested child element
        return;
      }

      var elemName = $(this).attr(attrName);
      var step = steps.find(stepId);

      if (!step) {
        console.error("No step found for step ID = ".concat(stepId));
        return;
      }

      isElemPickerActive = false;
      setClasses();
      setListeners();
      setCollapsed(false);
      hideElementLabel();

      _.set(step, 'params.element', elemName);

      steps.replace(stepId, step);
      onStepsUpdated();
      event.preventDefault();
      event.stopPropagation();
      this.blur();
    };

    var mouseEnterEventListener = function mouseEnterEventListener(event) {
      var rect = this.getBoundingClientRect();
      $elementLabel.text($(this).attr(attrName)).css({
        display: 'block',
        position: 'fixed',
        zIndex: 999999,
        left: rect.left,
        top: rect.bottom
      });
    };

    var mouseLeaveEventListener = hideElementLabel;

    var setListeners = function setListeners() {
      // Hijacks clicks on all possible elements
      // @todo Bug: When attrName changes, old event listeners are never removed
      $(document).find("[".concat(attrName, "]")).each(function () {
        if (isElemPickerActive) {
          this.addEventListener('click', clickEventListener, {
            capture: true
          });
          this.addEventListener('mouseenter', mouseEnterEventListener, {
            capture: true
          });
          this.addEventListener('mouseleave', mouseLeaveEventListener, {
            capture: true
          });
        } else {
          this.removeEventListener('click', clickEventListener, {
            capture: true
          });
          this.removeEventListener('mouseenter', mouseEnterEventListener, {
            capture: true
          });
          this.removeEventListener('mouseleave', mouseLeaveEventListener, {
            capture: true
          });
        }
      });
    };

    isElemPickerActive = !isElemPickerActive;
    setClasses();
    setListeners();
  });
  $container.on('change', '.pick-string, .pick-number', function () {
    var $input = $(this);
    var stepId = $input.attr('data-step-id');
    var step = steps.find(stepId);
    var paramName = $input.attr('data-param-name');

    if (step) {
      _.set(step, "params.".concat(paramName), $input.val());

      steps.replace(stepId, step);
      onStepsUpdated();
    } else {
      console.error("No step found for step ID = ".concat(stepId));
    }
  });
  $container.on('change', '.pick-string-preset', function () {
    var $select = $(this);
    var $input = $select.siblings('.pick-string');
    $input.val($input.val() + $select.val());
    $select.val('');
    $input.change();
  });
  $container.on('change', '.pick-page', function () {
    var $select = $(this);
    var $input = $select.siblings('.pick-string');
    $input.val($select.val());
    $select.val('');
    $input.change();
  });
  $container.on('change', '.pick-user', function () {
    var $select = $(this);
    var $input = $select.siblings('.pick-string');
    $input.val($select.val());
    $select.val('');
    $input.change();
  });
  $container.on('click', '.js-copy-step', function () {
    var stepId = $(this).closest('[data-step-id]').attr('data-step-id');
    steps.duplicate(stepId);
    onStepsUpdated();
    scrollToBottom();
  });
  $container.on('click', '.js-remove-step', function () {
    var stepId = $(this).closest('[data-step-id]').attr('data-step-id');
    steps.remove(stepId);
    onStepsUpdated();
  });
  /*
  	"Add step" dropdown
   */

  var $addStep = $("<select name=\"add_step\" class=\"add-step\"></select>").appendTo($stepsWrapper);
  $addStep.on('change', function () {
    var type = $addStep.find('option:selected').val();
    addStep(type);
    $addStep.val('');
  });

  function renderStepPicker() {
    var options = _.map(stepTemplates, function (steps, category) {
      var options = _.map(steps, function (template, key) {
        return "<option value=\"".concat(category, ".").concat(key, "\">").concat(template, "</option>");
      });

      var group = "<optgroup label=\"".concat(_.startCase(category), "\">").concat(options, "</optgroup>");
      return group;
    });

    options.unshift('<option value="" disabled selected>Add a step...</option>');
    $addStep.html(options.join(''));
  }
  /*
  	Controls
   */


  var $controls = $('<div />').addClass('controls clearfix').appendTo($container);
  var $collapseToggle = $('<button type="button" />').html('<i class="icon icon-collapse"></i><i class="icon icon-expand"></i>').addClass('collapse-toggle').appendTo($container);
  var $record = $('<button type="button" />').addClass('btn record').appendTo($controls);
  var $copy = $('<button type="button" />').addClass('btn copy').html('<i class="icon icon-copy"></i> Copy').appendTo($controls);
  var $download = $('<button type="button" />').addClass('btn download').html('<i class="icon icon-download"></i> Download').appendTo($controls);
  var $clear = $('<button type="button" />').addClass('btn clear').html('<i class="icon icon-trashcan"></i> Clear').appendTo($controls);
  $collapseToggle.on('click', toggleCollapsed);
  $record.on('click', function () {
    setIsRecording(!isRecording);
  });
  $copy.on('click', function () {
    var stepsText = getCopyableSteps(steps.getAll());
    $stepsText.val(stepsText);
    copyText($iframe, $stepsText);
    $copy.html('<i class="icon icon-copy"></i> Copied');
    setTimeout(function () {
      $copy.html('<i class="icon icon-copy"></i> Copy');
    }, 2000);
  });
  $download.on('click', function () {
    featureName = window.prompt('Enter a title for the feature:', featureName);
    scenarioName = window.prompt('Enter a title for the scenario:', scenarioName);
    var filename = _.kebabCase(featureName) + '.feature';
    var stepsText = getCopyableSteps(steps.getAll());
    var content = "Feature: ".concat(featureName, "\n===\n\n\nScenario: ").concat(scenarioName, "\n---\n").concat(stepsText, "\n");
    var blob = new Blob([content], {
      type: 'text/plain;charset=UTF-8'
    });
    var blobUrl = URL.createObjectURL(blob);
    send('download', {
      url: blobUrl,
      filename: filename,
      saveAs: true,
      conflictAction: 'overwrite'
    });
  });
  $clear.on('click', function () {
    setSteps([]);
  });
  listen('setActive', function (response) {
    setActive(response.isActive);
  });
  listen('setRecording', function (response) {
    setIsRecording(response.isRecording);
  });
  listen('navigate', function (response) {
    // implicit = user clicked a tracked link/button that triggered navigation
    var isImplicitNavigation = Date.now() - lastUserInteractionTime < implicitNavigationThreshold;

    if (isImplicitNavigation) {
      return;
    }

    var path = response.path.endsWith('/') ? response.path.substr(0, response.path.length - 1) : response.path; // Removes trailing slash

    var predicate = function predicate(valueToMatch) {
      return function (value) {
        return _.isRegExp(value) ? value.test(valueToMatch) : value === valueToMatch;
      };
    };

    var page = _.findKey(pages, predicate(path)) || _.findKey(pages, predicate(response.url)) || response.url;
    addStep('actions.navigate', {
      page: page
    });
  });
  send('getActive', {}, function (response) {
    setActive(response.isActive);
  });
  send('getRecording', {}, function (response) {
    setIsRecording(response.isRecording);
  });
  send('getOptions', {}, function (options) {
    unbindUserEvents();
    options = options || {};
    attrName = options.element_attr || attrName;
    attrValueName = options.value_attr || attrValueName;
    implicitNavigationThreshold = options.nav_threshold || implicitNavigationThreshold;

    if (isActive) {
      updateStylesheet();
      bindUserEvents();
    }

    setRawSteps(options.steps);
    setRawPages(options.pages);
    setRawUsers(options.users);
  });
  listen('setOptions', function (options) {
    if (attrName !== options.element_attr || attrValueName !== options.value_attr || implicitNavigationThreshold !== options.nav_threshold) {
      unbindUserEvents();
      attrName = options.element_attr;
      attrValueName = options.value_attr;
      implicitNavigationThreshold = options.nav_threshold;
      bindUserEvents();
      updateStylesheet();
    }

    setRawSteps(options.steps);
    setRawPages(options.pages);
    setRawUsers(options.users);
  });

  function setRawPages(newRawPages) {
    if (newRawPages === rawPages) {
      // No change
      return;
    }

    rawPages = newRawPages;
    pages = safeEval(rawPages) || {};
    renderSteps();
  }

  function setRawUsers(newRawUsers) {
    if (newRawUsers === rawUsers) {
      // No change
      return;
    }

    rawUsers = newRawUsers;
    users = safeEval(rawUsers) || {};
    renderSteps();
  }

  function setRawSteps(newRawSteps) {
    if (newRawSteps === rawSteps) {
      // No change
      return;
    }

    rawSteps = newRawSteps;
    stepTemplates = safeEval(rawSteps) || {};
    steps = new Steps(stepTemplates);
    renderStepPicker();
    renderSteps();
  }

  function safeEval(js) {
    var value;

    try {
      value = Function("'use strict'; return (".concat(js, ")"))();
    } catch (error) {
      value = undefined;
    }

    return value;
  }

  function setActive(newIsActive) {
    isActive = newIsActive;
    showPane(isActive);

    if (isActive) {
      bindUserEvents();
      addStylesheet();
      reloadSteps();
    } else {
      unbindUserEvents();
      removeStylesheet();
    }
  }

  function showPane(isActive) {
    $iframe.toggleClass('hidden', !isActive);
    resizeIframe();
  }

  function toggleCollapsed() {
    setCollapsed(!isCollapsed);
  }

  function setCollapsed(newIsCollapsed) {
    isCollapsed = newIsCollapsed;
    $collapseToggle.toggleClass('-collapsed', isCollapsed);
    $container.toggleClass('-collapsed', isCollapsed);
    $iframe.toggleClass('--gherkin-scenario-builder-collapsed', isCollapsed);

    if (!isCollapsed) {
      resizeIframe();
      setTimeout(resizeIframe, 50);
    }
  }

  function resizeIframe() {
    var height = $iframe.contents().find('.container').height();
    $iframe.css('height', height);
  }

  function renderSteps() {
    var stepsFormatted = getFormattedSteps(steps.getAll());

    if (stepsFormatted.length) {
      $steps.html(stepsFormatted.join(''));
      $steps.removeClass('hidden');
      $steps.removeClass('hidden');
      $steps.sortable({
        cursor: '-webkit-grabbing',
        update: reorderSteps
      });
      $steps.disableSelection();
    } else {
      $steps.addClass('hidden');
    }

    $container.toggleClass('-has-steps', stepsFormatted.length > 0);
    resizeIframe();
  }

  function reorderSteps() {
    var reorderedSteps = [];
    $steps.find('.step').each(function () {
      var $step = $(this);
      var stepId = $step.attr('data-step-id');
      reorderedSteps.push(steps.get(stepId));
    });
    setSteps(reorderedSteps);
  }

  function setIsRecording(newIsRecording) {
    isRecording = newIsRecording;
    send('setRecording', {
      isRecording: isRecording
    });
    renderRecordingState();
  }

  function renderRecordingState() {
    $container.toggleClass('-recording', isRecording);
    var text = isRecording ? 'Recording' : 'Record';
    $record.html("<i class=\"icon icon-media-record\"></i>".concat(text));
  }

  function addStep(type) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    steps.add(type, params);
    onStepsUpdated();
    scrollToBottom();
  }

  function setSteps(newSteps) {
    steps.setAll(newSteps);
    onStepsUpdated();
  }

  function onStepsUpdated() {
    saveSteps();
    renderSteps();
  }

  function saveSteps() {
    send('setSteps', {
      steps: steps.getAll()
    });
  }

  function reloadSteps() {
    send('getSteps', {}, function (response) {
      setSteps(response.steps);
    });
  }

  function scrollToBottom() {
    $steps.get(0).scrollTop = $steps.get(0).scrollHeight;
  }

  function getCopyableSteps(steps) {
    return _(steps).map(function (step) {
      var stepTemplate = _.get(stepTemplates, step.type);

      var interpolated = getCopyableStep(stepTemplate, step.params);

      var prefix = _.startCase(step.prefix);

      return "".concat(prefix, " ").concat(interpolated);
    }).join('\n');
  }

  function getCopyableStep(stepTemplate, params) {
    return _.reduce(params, function (stepText, paramValue, paramName) {
      var isStringValue = paramName === 'string' || paramName === 'element' || paramName === 'page' || paramName === 'user';
      var outputValue = isStringValue ? "\"".concat(paramValue, "\"") : paramValue;
      return stepText.replace("{".concat(paramName, "}"), outputValue);
    }, stepTemplate);
  }

  function getFormattedSteps(steps) {
    return _.map(steps, function (step, index) {
      text = step.template.replace(/\{(string|page|user|int|float|element)\}/g, function (match, param) {
        if (param === 'int' || param === 'float') {
          return "<input type=\"number\" class=\"pick-number\" data-step-id=\"".concat(step.id, "\" data-param-name=\"").concat(param, "\" value=\"").concat(step.params[param] || 0, "\">");
        } else if (param === 'string') {
          var optgroups = _.map(stringPresets, function (presets, category) {
            var options = _.map(presets, function (preset) {
              return "<option value=\"".concat(_.escape(preset), "\">").concat(_.escape(preset), "</option>");
            });

            return "<optgroup label=\"".concat(_.startCase(category), "\">").concat(options, "</optgroup>");
          });

          return "\n\t\t\t\t\t\t<input type=\"text\" class=\"pick-string\" data-step-id=\"".concat(step.id, "\" data-param-name=\"string\" value=\"").concat(step.params.string || '', "\">\n\t\t\t\t\t\t<select class=\"pick-string-preset\">\n\t\t\t\t\t\t\t<option value=\"\" disabled selected>\u2699 Presets:</option>\n\t\t\t\t\t\t\t").concat(optgroups, "\n\t\t\t\t\t\t</select>\n\t\t\t\t\t");
        } else if (param === 'page') {
          var options = _.map(pages, function (path, page) {
            return "<option value=\"".concat(_.escape(page), "\">").concat(_.escape(page), "</option>");
          });

          return "\n\t\t\t\t\t\t<input type=\"text\" class=\"pick-string\" data-step-id=\"".concat(step.id, "\" data-param-name=\"page\" value=\"").concat(step.params.page || '', "\">\n\t\t\t\t\t\t<select class=\"pick-page\">\n\t\t\t\t\t\t\t<option value=\"\" disabled selected>\uD83D\uDCC4 Pages:</option>\n\t\t\t\t\t\t\t").concat(options, "\n\t\t\t\t\t\t</select>\n\t\t\t\t\t");
        } else if (param === 'user') {
          var _options = _.map(users, function (info, user) {
            return "<option value=\"".concat(_.escape(user), "\">").concat(_.escape(user), "</option>");
          });

          return "\n\t\t\t\t\t\t<input type=\"text\" class=\"pick-string\" data-step-id=\"".concat(step.id, "\" data-param-name=\"user\" value=\"").concat(step.params.user || '', "\">\n\t\t\t\t\t\t<select class=\"pick-user\">\n\t\t\t\t\t\t\t<option value=\"\" disabled selected>\uD83D\uDC64 Users:</option>\n\t\t\t\t\t\t\t").concat(_options, "\n\t\t\t\t\t\t</select>\n\t\t\t\t\t");
        } else if (param === 'element') {
          var elemName = step.params.element || '<i class="icon icon-mouse-pointer"></i> Choose element';
          var className = step.params.element ? '-picked' : '';
          return "\n\t\t\t\t\t<button class=\"pick-element js-pick-element ".concat(className, "\" data-step-id=\"").concat(step.id, "\" title=\"").concat(step.params.element, "\">\n\t\t\t\t\t\t").concat(elemName, "\n\t\t\t\t\t</button>");
        } else {
          return param;
        }
      });
      var prefix = step.prefix ? "".concat(_.startCase(step.prefix), " ") : '';
      return "\n\t\t\t\t<div class=\"step\" data-step-id=\"".concat(step.id, "\">\n\t\t\t\t\t").concat(prefix).concat(text, "\n\t\t\t\t\t<i class=\"copy-step icon-copy js-copy-step\" title=\"Duplicate this step\"></i>\n\t\t\t\t\t<i class=\"remove-step icon-close js-remove-step\" title=\"Remove this step\"></i>\n\t\t\t\t</div>\n\t\t\t");
    });
  }

  function copyText($iframe, $input) {
    var success;
    var window = $iframe.get(0).contentWindow;
    $input.get(0).select();

    try {
      var success = window.document.execCommand('copy');
    } catch (error) {
      console.error("Error copying: ".concat(error));
    }

    window.getSelection().removeAllRanges();
  }

  function bindUserEvents() {
    if (!attrName || !attrValueName) {
      return;
    }
    /*
    	Text/file input
     */


    $(document).on("change.".concat(eventNamespace), "[".concat(attrName, "]:input, [").concat(attrName, "] :input"), function () {
      // Ignores non-textual/file inputs
      if (!$(this).is('input[type="text"]') && !$(this).is('input[type="email"]') && !$(this).is('input[type="password"]') && !$(this).is('input[type="date"]') && !$(this).is('input[type="number"]') && !$(this).is('input[type="file"]') && !$(this).is('textarea')) {
        return;
      }

      if (!isActive || !isRecording) {
        return;
      }

      var $input = $(this);
      var element = $input.closest("[".concat(attrName, "]")).attr(attrName);
      var value = $input.val();

      if ($input.is('[type="file"]')) {
        value = value.replace('C:\\fakepath\\', '');
      }

      addStep('actions.set', {
        element: element,
        string: value
      });
      lastUserInteractionTime = Date.now();
    });
    /*
    	Select
     */

    $(document).on("change.".concat(eventNamespace), "select[".concat(attrName, "], [").concat(attrName, "] select"), function () {
      var element = $(this).closest("[".concat(attrName, "]")).attr(attrName);
      var value = $(this).find('option:selected').text();

      if (isActive && isRecording) {
        addStep('actions.set', {
          element: element,
          string: value
        });
        lastUserInteractionTime = Date.now();
      }
    });
    /*
    	Checkbox
     */

    $(document).on("change.".concat(eventNamespace), "[".concat(attrName, "]:checkbox, [").concat(attrName, "] :checkbox"), function () {
      var element = $(this).closest("[".concat(attrName, "]")).attr(attrName);
      var value = $(this).attr(attrValueName) || ($(this).is(':checked') ? 'checked' : 'unchecked');

      if (isActive && isRecording) {
        addStep('actions.set', {
          element: element,
          string: value
        });
        lastUserInteractionTime = Date.now();
      }
    });
    /*
    	Radio
     */

    $(document).on("change.".concat(eventNamespace), "[".concat(attrName, "]:radio, [").concat(attrName, "] :radio"), function () {
      var element = $(this).closest("[".concat(attrName, "]")).attr(attrName);
      var value = $(this).attr(attrValueName) || $(this).filter(':checked').val();

      if (isActive && isRecording) {
        addStep('actions.set', {
          element: element,
          string: value
        });
        lastUserInteractionTime = Date.now();
      }
    });
    /*
    	Click
     */

    $(document).on("click.".concat(eventNamespace), "[".concat(attrName, "]"), function () {
      var containsInput = $(this).find(':input:visible').not('input[type="submit"]').length > 0;

      if ($(this).is('input[type="text"') || $(this).is('input[type="email"') || $(this).is('input[type="password"') || $(this).is('input[type="date"') || $(this).is('input[type="number"') || $(this).is('input[type="checkbox"') || $(this).is('input[type="radio"') || $(this).is('input[type="file"') || $(this).is('textarea') || $(this).is('select') || containsInput) {
        // Click steps should not be generated for non-submit inputs
        return;
      }

      if (!isActive || !isRecording) {
        return;
      }

      var element = $(this).attr(attrName);
      addStep('actions.click', {
        element: element
      });
      lastUserInteractionTime = Date.now();
    });
  }

  function unbindUserEvents() {
    $(document).off(".".concat(eventNamespace));
  }

  function addStylesheet() {
    $('head').append("<style id=\"gherkin-scenario-builder-styles\">\n.--gherkin-scenario-builder-show-elements [".concat(attrName, "] {\n\toutline: 3px solid rgba(255, 0, 170, 0.75);\n\tcursor: pointer;\n}\n</style>"));
  }

  function removeStylesheet() {
    $('#gherkin-scenario-builder-styles').remove();
  }

  function updateStylesheet() {
    removeStylesheet();
    addStylesheet();
  }

  function send(action, params) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    chrome.runtime.sendMessage(_objectSpread({
      action: action
    }, params), callback);
  }

  function listen(action, callback) {
    listeners[action] = listeners[action] || [];
    listeners[action].push(callback);
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = listeners[request.action][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var listener = _step.value;
        listener(request);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
});
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53329" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","content.js"], null)
//# sourceMappingURL=/content.b60ea27a.js.map