function setAndGetSiteData(step, steps) {
  steps.push(step);
  localStorage.setItem("siteData", JSON.stringify(steps));
  const siteData = JSON.parse(localStorage.getItem("siteData"));
//   console.log(step);

  let action = step.action;
  switch (action) {
    case "sendKeys":
      $("#js_recorder").append(
        "<tr>" +
          "<th scope='row'>" +
          step.step_id +
          "</th>" +
          "<td>" +
          step.action +
          "</td>" +
          "<td>" +
          step.attributes.id +
          "</td>" +
          "<td>" +
          step.value +
          "</td>" +
          "</tr>"
      );
      break;
    case "select":

      if ($("#js_recorder").find("#" + step.attributes.id).length) {
        $("#js_recorder #" + step.attributes.id).remove();
      }
      $("#js_recorder").append(
        "<tr id=" +
          step.attributes.id +
          ">" +
          "<th scope='row'>" +
          step.step_id +
          "</th>" +
          "<td>" +
          step.action +
          "</td>" +
          "<td>" +
          step.attributes.id +
          "</td>" +
          "<td>" +
          step.value +
          "</td>" +
          "</tr>"
      );

      break;
    case "click":
      $("#js_recorder").append(
        "<tr>" +
          "<th scope='row'>" +
          step.step_id +
          "</th>" +
          "<td>" +
          step.action +
          "</td>" +
          "<td>" +
          step.attributes.id +
          "</td>" +
          "</tr>"
      );
      break;
  }
}



// $.each(siteData, function (index, value) {
//     $("#js_recorder").append(index + ": " + value.step_id + '<br>');
// });
//   $("#js_recorder").append("<p><strong>" + step.step_id + "</p></strong>");
//   $("#js_recorder").append("<p>" + step.action + "</p>");
//   $("#js_recorder").append("<p>" + step.value + "</p>");
//   $("#js_recorder").append(    "<p>" + "attribute_id" + step.attributes.id + "</p>"  );
//   $("#js_recorder").append(    "<p>" + "attribute_name" + step.attributes.name + "</p>"  );

//   $("#js_recorder").append(
//     $("<label/>", {
//       id: step.step_id,
//       name: step.step_id,
//       text: step.step_id,
//       class: "text-white"
//     }),
//     $("<input/>", {
//       type: "text",
//       id: step.value,
//       name: step.value,
//       value: step.value,
//       placeholder: "Value",
//       class: "form-control"
//     }) // Creating Input Element With Attribute.
//   );
