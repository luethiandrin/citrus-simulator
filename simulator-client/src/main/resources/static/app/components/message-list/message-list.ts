import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {Message} from "../../model/test";

@Component({
    moduleId: module.id,
    selector: 'message-list',
    templateUrl: 'message-list.html',
    styleUrls: ['message-list.css']
})
export class MessageListComponent {
    @Input() messages: Message[];

    inputValue: string = '';
    displayFilter: boolean = false;

    selectedMessage: Message;
    format: string = "yyyy-MM-dd HH:mm:ss";

    constructor(private router: Router) {
    }

    onSelect(message: Message) {
        this.selectedMessage = message;
        this.gotoMessageDetail();
    }

    gotoMessageDetail() {
        this.router.navigate(['messages', this.selectedMessage.messageId]);
    }

    toggleFilterDisplay() {
        this.displayFilter = !this.displayFilter;
    }

    clearAllMessages() {
        console.log("TODO");
    }

}
