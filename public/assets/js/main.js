const main = () => {
  const init = () => {
    window.addEventListener("DOMContentLoaded", function () {
      handleNavInteractions();
    });
  };

  const handleNavInteractions = () => {
    const desktopMenus = document.querySelectorAll("#desktop-nav .nav-menu");
    const mobileSidebar = document.getElementById("mobile-nav");
    const mobileBackdrop = document.getElementById("mobile-nav-bd");
    const mobileMenu = document.getElementById("hamburger");
    const mobileClose = document.getElementById("sb-close");
    const mobileItemExpand =
      document.getElementsByClassName("mobile-item-expand");
    const mobileItemClose =
      document.getElementsByClassName("mobile-item-close");

    mobileSidebar.style.transform = "translateX(-100%)";
    mobileMenu.addEventListener("click", (evt) => {
      sidebarHandler(true);
    });
    mobileClose.addEventListener("click", (evt) => {
      sidebarHandler(false);
    });
    mobileBackdrop.addEventListener("click", (evt) => {
      sidebarHandler(false);
    });

    for (const expBtn of mobileItemExpand) {
      expBtn.addEventListener("click", (evt) => {
        mobileItemHandler(
          true,
          expBtn.closest("li").querySelector(".mobile-items"),
          expBtn,
          expBtn.closest("div").querySelector(".mobile-item-close")
        );
      });
    }

    for (const clBtn of mobileItemClose) {
      clBtn.addEventListener("click", (evt) => {
        mobileItemHandler(
          false,
          clBtn.closest("li").querySelector(".mobile-items"),
          clBtn.closest("div").querySelector(".mobile-item-expand"),
          clBtn
        );
      });
    }

    for (const top of desktopMenus) {
      const menu = top.getElementsByTagName("ul")[0];
      top.addEventListener("mouseover", (evt) => {
        menu.classList.toggle("hidden");
      });
      document.addEventListener("mouseout", (evt) => {
        menu.classList.add("hidden");
      });
    }

    const sidebarHandler = (check) => {
      if (check) {
        mobileSidebar.style.transform = "translateX(0px)";
        document.body.classList.add("overflow-hidden");
        mobileMenu.classList.add("hidden");
        mobileClose.classList.remove("hidden");
      } else {
        mobileSidebar.style.transform = "translateX(-100%)";
        document.body.classList.remove("overflow-hidden");
        mobileMenu.classList.remove("hidden");
        mobileClose.classList.add("hidden");
      }
    };

    const mobileItemHandler = (check, menu, expand, close) => {
      if (check) {
        menu.classList.remove("hidden");
        expand.classList.add("hidden");
        close.classList.remove("hidden");
      } else {
        menu.classList.add("hidden");
        expand.classList.remove("hidden");
        close.classList.add("hidden");
      }
    };
  };

  const handleAlertInteractions = () => {
    var alert = document.getElementById("alert");
    var close = document.getElementById("close-modal");
    Alert.style.transform = "translateY(0%)";
    function closeAlert() {
      Alert.style.transform = "translateY(-200%)";
      setTimeout(function () {
        Alert.style.transform = "translateY(0%)";
      }, 1000);
    }
  };

  init();
};

main();
