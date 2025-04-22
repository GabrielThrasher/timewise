import Modal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    zIndex: "9999",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "85%",
    height: "600px",
    overflow: "none",
  },
};

Modal.setAppElement("#timewise-app");

function TimewiseModal({ children, ...props }: Modal.Props) {
  return (
    <Modal
      {...props}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      style={props.style ? props.style : customStyles}
    >
      <div className="h-full">{children}</div>
    </Modal>
  );
}

export default TimewiseModal;
