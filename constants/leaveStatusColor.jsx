import Colors from "./Colors";
import leaveStatus from "./leaveStatus";


export function leaveStatusColor(status) {
    return status === leaveStatus.Pending
        ? "orange"
        : status === leaveStatus.Approved
            ? Colors.lightBlue
            : status === leaveStatus.Rejected
                ? "red"
                : "gray";
}