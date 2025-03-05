const MailInbox = () => {
    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Inbox</h1>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Sender</th>
                            <th className="border border-gray-300 p-2">Subject</th>
                            <th className="border border-gray-300 p-2">Preview</th>
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2 font-semibold">John Doe</td>
                            <td className="border border-gray-300 p-2">Project Update</td>
                            <td className="border border-gray-300 p-2">Here is a brief update on the project status...</td>
                            <td className="border border-gray-300 p-2">03/03/2025</td>
                            <td className="border border-gray-300 p-2">10:30 AM</td>
                        </tr>
                        <tr className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2 font-semibold">Jane Smith</td>
                            <td className="border border-gray-300 p-2">Meeting Reminder</td>
                            <td className="border border-gray-300 p-2">Don&apos;t forget our scheduled meeting tomorrow...</td>
                            <td className="border border-gray-300 p-2">03/08/2025</td>
                            <td className="border border-gray-300 p-2">02:15 PM</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default MailInbox;
