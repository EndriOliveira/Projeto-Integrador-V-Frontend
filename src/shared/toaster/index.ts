import SweetAlert from "sweetalert2";

const Toast = SweetAlert.mixin({
  toast: true,
  position: "bottom-start",
  background: "var(--primary-color)",
  color: "var(--white-color)",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", SweetAlert.stopTimer);
    toast.addEventListener("mouseleave", SweetAlert.resumeTimer);
  },
});

type iconTypes = "success" | "error" | "warning" | "info" | "question";
const makeToast = (type: iconTypes, msg: string) => {
  Toast.fire({
    icon: type,
    title: msg,
  });
};

export default makeToast;
