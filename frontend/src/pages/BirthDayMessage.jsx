import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BirthDayMessage() {
  const [textMessage, setTextMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [subject, setSubject] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [dataId, setDataId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://crm.bees.in/api/v1/births")
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const item = data[0];
          setTextMessage(item.message);
          setSubject(item.sub);
          setAttachmentUrl(
            item.Attachment ? `https://crm.bees.in/${item.Attachment}` : ""
          );
          setDataId(item._id);
        }
      })
      .catch(error => {
        toast.error("Error fetching data");
        console.error("Error fetching data:", error);
      });
  };

  const handleFileChange = e => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!textMessage || !subject) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    const formData = new FormData();
    formData.append("message", textMessage);
    formData.append("sub", subject);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    fetch(`https://crm.bees.in/api/v1/births/${dataId}`, {
      method: "PUT",
      body: formData,
    })
      .then(response => response.json())
      .then(() => {
        toast.success("Birthday message updated successfully!");
        fetchData();
      })
      .catch(error => {
        toast.error("Error updating message");
        console.error("Error updating message:", error);
      });
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
      style={{ color: "#4b57ad" }}
    >
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#4b57ad" }}>
        Birthday Message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Enter the subject here"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b57ad] focus:border-[#4b57ad] sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="text-message"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            Text Message:
          </label>
          <textarea
            id="text-message"
            value={textMessage}
            onChange={e => setTextMessage(e.target.value)}
            placeholder="Enter your birthday message here"
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b57ad] focus:border-[#4b57ad] sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="attachment"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            Attachment:
          </label>
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b57ad] focus:border-[#4b57ad] sm:text-sm"
          />
          <p className="text-red-600 mt-1">
            Attachment size should not be more than 25 MB.
          </p>
          {attachmentUrl && (
            <div className="mt-2">
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white bg-[#4b57ad] px-4 py-2 rounded-md shadow-sm hover:bg-[#4b57ad]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b57ad]"
              >
                View Current Attachment
              </a>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#4b57ad] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#4b57ad]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b57ad]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default BirthDayMessage;
