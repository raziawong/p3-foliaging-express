function main() {
  function init() {
    window.addEventListener("DOMContentLoaded", function () {
      handleNavInteractions();
    });
  }

  function handleNavInteractions() {
    const desktopMenus = document.querySelectorAll("#desktop-nav .nav-menu");
    const mobileSidebar = document.getElementById("mobile-nav");
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
        menu.classList.remove("hidden");
      });
      menu.addEventListener("mouseout", (evt) => {
        menu.classList.add("hidden");
      });
    }

    const sidebarHandler = (check) => {
      if (check) {
        mobileSidebar.style.transform = "translateX(0px)";
        mobileMenu.classList.add("hidden");
        mobileClose.classList.remove("hidden");
      } else {
        mobileSidebar.style.transform = "translateX(-100%)";
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
  }

  init();
}

main();

// let list = document.getElementById("list");
// let chevrondown = document.getElementById("chevrondown");
// let chevronup = document.getElementById("chevronup");
// const listHandler = (check) => {
//   if (check) {
//     list.classList.remove("hidden");
//     chevrondown.classList.remove("hidden");
//     chevronup.classList.add("hidden");
//   } else {
//     list.classList.add("hidden");
//     chevrondown.classList.add("hidden");
//     chevronup.classList.remove("hidden");
//   }
// };
// let list2 = document.getElementById("list2");
// let chevrondown2 = document.getElementById("chevrondown2");
// let chevronup2 = document.getElementById("chevronup2");
// const listHandler2 = (check) => {
//   if (check) {
//     list2.classList.remove("hidden");
//     chevrondown2.classList.remove("hidden");
//     chevronup2.classList.add("hidden");
//   } else {
//     list2.classList.add("hidden");
//     chevrondown2.classList.add("hidden");
//     chevronup2.classList.remove("hidden");
//   }
// };
