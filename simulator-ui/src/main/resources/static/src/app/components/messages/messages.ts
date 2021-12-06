import {Component, OnDestroy, OnInit} from "@angular/core";
import {MessageService} from "../../services/message-service";
import {Message} from "../../model/scenario";
import {MessageFilter} from "../../model/filter";
import * as moment from "moment";

@Component({
    moduleId: module.id,
    templateUrl: 'messages.html',
    styleUrls: ['messages.css',  '../../../assets/css/filter-section.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
    messageFilter: MessageFilter;
    messages: Message[];
    errorMessage: string;

    autoRefreshId: number;

    inputDateFrom: any;
    inputTimeFrom: any;
    inputDateTo: any;
    inputTimeTo: any;

    constructor(private messageService: MessageService) {
    }

    ngOnInit() {
        this.messageFilter = this.initMessageFilter();
        this.getMessages();
        this.autoRefreshId = window.setInterval(() => {
            if (this.messageFilter.pageNumber == 0 && this.messageFilter.pageSize < 250) {
                this.getMessages();
            }
        }, 5000);
    }

    ngOnDestroy(): void {
        window.clearInterval(this.autoRefreshId);
    }

    getMessages() {
        this.messageService.getMessages(this.messageFilter)
            .subscribe( {
                next: (messages) => this.messages = messages,
                error: (error) => this.errorMessage = <any>error
            });
    }

    clearMessages() {
        this.messageService.clearMessages().subscribe({
            next: (success) => this.getMessages(),
            error: (error) => this.errorMessage = <any>error
        });
    }

    prev() {
        if (this.messageFilter.pageNumber > 0) {
            this.messageFilter.pageNumber--;
            this.getMessages();
        }
    }

    next() {
        if (!this.messages) {
            return;
        }
        let hasPotentialNextPage = this.messages.length && this.messages.length == this.messageFilter.pageSize;
        if (hasPotentialNextPage) {
            this.messageFilter.pageNumber++;
            this.getMessages();
        }
    }

    setDateTimeFrom(): void {
        if (this.inputDateFrom && this.inputTimeFrom) {
            // converts 12h to 24h
            let time = moment(this.inputTimeFrom, ["h:mm A"]).format("HH:mm");
            let date = this.inputDateFrom.split("/");
            let timeNum = time.split(':').map(Number);
            //-1 because the month starts at index 0
            this.messageFilter.fromDate = new Date(date[2], date[0]-1, date[1], timeNum[0], timeNum[1]).toISOString();
        }
    }

    setDateTimeTo(): void {
        if (this.inputDateTo && this.inputTimeTo) {
            // converts 12h to 24h
            let time = moment(this.inputTimeTo, ["h:mm A"]).format("HH:mm");
            let date = this.inputDateTo.split("/");
            let timeNum = time.split(':').map(Number);
            //-1 because the month starts at index 0
            this.messageFilter.toDate = new Date(date[2], date[0]-1, date[1], Number(timeNum[0]), Number(timeNum[1])).toISOString();
        }
    }

    toggleInbound() {
        this.messageFilter.directionInbound = !this.messageFilter.directionInbound;
        this.getMessages();
    }

    toggleOutbound() {
        this.messageFilter.directionOutbound = !this.messageFilter.directionOutbound;
        this.getMessages();
    }

    initMessageFilter(): MessageFilter {
        return new MessageFilter(null, null, 0, 25, true, true, '');
    }

    changePageSize(pageSize: number) {
        this.messageFilter.pageSize = pageSize;
        this.messageFilter.pageNumber = 0;
        this.getMessages();
    }
}
