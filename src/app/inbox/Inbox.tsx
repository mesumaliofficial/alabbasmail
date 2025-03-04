const MailInbox = () => {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Inbox</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Sender</th>
                        <th className="border border-gray-300 p-2">Subject</th>
                        <th className="border border-gray-300 p-2">Preview</th>
                        <th className="border border-gray-300 p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-2 font-semibold text-center">John Doe</td>
                        <td className="border border-gray-300 p-2">Project Update</td>
                        <td className="border border-gray-300 p-2">Here is a brief update on the project status...</td>
                        <td className="border border-gray-300 p-2">03/03/2025</td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-2 font-semibold text-center">Jane Smith</td>
                        <td className="border border-gray-300 p-2">Meeting Reminder</td>
                        <td className="border border-gray-300 p-2">Don't forget our scheduled meeting tomorrow...</td>
                        <td className="border border-gray-300 p-2">03/803/2025</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default MailInbox;