const multiupload = () => {
  uploadcare.registerTab("preview", uploadcareTabEffects);
  window.addEventListener("DOMContentLoaded", () => {
    const multiWidget = uploadcare.MultipleWidget(
      "[role=uploadcare-uploader][data-multiple]"
    );
    const wrapper = document.getElementById("image-upload-wrapper");
    const fileGroupInput = document.querySelector(
      "input[name=uploadcare_group_id]"
    );
    if (fileGroupInput && fileGroupInput.value) {
      multiWidget.value(fileGroupInput.value);
    }

    multiWidget.onChange((fileGroup) => {
      fileGroup.promise().done((groupInfo) => {
        fileGroupInput.value = groupInfo.uuid;
      });
    });
  });
};

multiupload();
