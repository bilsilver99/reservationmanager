import "./customAlertModal.css"; // Import your custom CSS file for styling

const CustomAlertModal = ({ message, onClose }) => {
  return (
    <div className="custom-alert-modal">
      <div className="custom-alert-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CustomAlertModal;
