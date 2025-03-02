import { useState } from "react";
import { IoMdPersonAdd, IoMdMail } from "react-icons/io";

type Lead = {
  name: string;
  email: string;
  company: string;
  status: string;
};

type AddLeadFormProps = {
  newLead: Lead;
  setNewLead: (lead: Lead) => void;
  addLead: () => void;
};

const AddLeadForm: React.FC<AddLeadFormProps> = ({ newLead, setNewLead, addLead }) => {
  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-3">Add New Lead</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={newLead.name}
          onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
          className="border p-2 rounded-md w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={newLead.email}
          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          className="border p-2 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Company"
          value={newLead.company}
          onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
          className="border p-2 rounded-md w-full"
        />
        <select
          value={newLead.status}
          onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Select Status</option>
          <option value="Interested">Interested</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Not Interested">Not Interested</option>
        </select>
      </div>
      <button
        onClick={addLead}
        className="mt-4 flex items-center space-x-2 bg-blue-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
      >
        <IoMdPersonAdd className="text-xl" />
        <span>Add Lead</span>
      </button>
    </div>
  );
};

type SendMailFormProps = {
  email: string;
  setEmail: (email: string) => void;
  sendMail: () => void;
};

const SendMailForm: React.FC<SendMailFormProps> = ({ email, setEmail, sendMail }) => {
  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-green-900 mb-3">Send Mail</h3>
      <input
        type="email"
        placeholder="Recipient Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded-md w-full"
      />
      <textarea
        placeholder="Message"
        className="border p-2 rounded-md w-full mt-2"
      ></textarea>
      <button
        onClick={sendMail}
        className="mt-4 flex items-center space-x-2 bg-green-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition"
      >
        <IoMdMail className="text-xl" />
        <span>Send Mail</span>
      </button>
    </div>
  );
};

const LeadManagement: React.FC = () => {
  const [newLead, setNewLead] = useState<Lead>({ name: "", email: "", company: "", status: "" });
  const [email, setEmail] = useState<string>("");

  const addLead = () => {
    console.log("Lead added", newLead);
  };

  const sendMail = () => {
    console.log("Mail sent to", email);
  };

  return (
    <div className="p-6">
      <AddLeadForm newLead={newLead} setNewLead={setNewLead} addLead={addLead} />
      <SendMailForm email={email} setEmail={setEmail} sendMail={sendMail} />
    </div>  
  );
};

export default LeadManagement;