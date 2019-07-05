function isEquivalent(obj1, obj2) {
  var aProps = Object.getOwnPropertyNames(obj1);
  var bProps = Object.getOwnPropertyNames(obj2);
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (obj1[propName] !== obj2[propName]) {
      return false;
    }
  }
  return true;
}

function getRamdonNumber() {
  return Math.floor(Date.now() + Math.random());
}

function getFinalAttributes(element) {
  let final_attributes = Object.create(null);
  $.each(element.get(0).attributes, function (i, attrib) {
    final_attributes[attrib.name] = attrib.value
  });
  return final_attributes;
}

function getFinalParentAttributes(element) {
  let final_parent_attributes = Object.create(null);
  $.each(element.parent().get(0).attributes, function (i, attrib) {
    final_parent_attributes[attrib.name] = attrib.value
  });
  return final_parent_attributes;

}
$(document).ready(function () {
  let steps = [];
  let step = {};


  $(document).delegate("button, a", "click", function () {
    step = Object.create(null)
    let element = $(this);
    step["step_id"] = getRamdonNumber();
    step["action"] = "click";
    step["attributes"] = getFinalAttributes(element);
    step["parent_attributes"] = getFinalParentAttributes(element);
    steps.push(step);
    localStorage.setItem('siteData', JSON.stringify(steps));

  });

  $(document).delegate("input, textarea", "focusout", function (e) {
    let element = $(this);
    step = Object.create(null)
    step["step_id"] = getRamdonNumber();
    step["action"] = "sendKeys";
    step["attributes"] = getFinalAttributes(element);
    step["parent_attributes"] = getFinalParentAttributes(element);
    step.value = element.val();

    for (var i = 0; i < steps.length; i++) {
      var isEqual = isEquivalent(steps[i].attributes, step.attributes)
      if (isEqual) {
        steps.splice(i, 1)
      }
    }
    steps.push(step);
    console.log(steps);
    localStorage.setItem('siteData', JSON.stringify(steps));
  });

  $(document).delegate("select", "change", function (e) {
    let element = $(this);
    step = Object.create(null)
    step["step_id"] = getRamdonNumber();
    step["action"] = "select";
    step["attributes"] = getFinalAttributes(element);
    step["parent_attributes"] = getFinalParentAttributes(element);
    step["value"] = element.val();
    let selectedText = element.find('option:selected').text()
    step["text"] = selectedText
    for (var i = 0; i < steps.length; i++) {
      var isEqual = isEquivalent(steps[i].attributes, step.attributes)
      if (isEqual) {
        steps.splice(i, 1)
      }
    }
    steps.push(step);
    localStorage.setItem('siteData', JSON.stringify(steps));


  });

  // $("input").focusout(function () {

  // });

});