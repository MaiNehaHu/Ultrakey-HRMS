import taskStatus from "./taskStatus";
import Colors from "./Colors";

export function taskStatusColor(status) {
    return status === taskStatus.Ongoing
        ?
        "orange"
        :
        status === taskStatus.Completed
            ?
            "green"
            :
            status === taskStatus.Overdue
                ?
                "red" :
                status === taskStatus.New
                    ?
                    Colors.lightBlue
                    :
                    "grey";
}
