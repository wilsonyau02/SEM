import { Modal } from "antd";

function ApplicationModal({isModalOpen, onChangeModal, applicationID}) {

    console.log("In modal", applicationID);

    return(
        <Modal
        title="Basic Modal"
        visible={isModalOpen}
        onOk={() => onChangeModal(false)}
        onCancel={() => onChangeModal(false)}
        >
        <p>Some contents...</p>
        </Modal>
    )
}

export default ApplicationModal;