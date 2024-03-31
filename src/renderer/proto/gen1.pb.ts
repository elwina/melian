/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 5.26.0
 * source: gen1.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class InfFastScreenBoard extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        totalWidthmm: number;
        mm2px: number;
        totalWave: number;
        row: number;
        func: string;
        wave: number[];
        instense: number[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [6, 7], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            this.totalWidthmm = data.totalWidthmm;
            this.mm2px = data.mm2px;
            this.totalWave = data.totalWave;
            this.row = data.row;
            this.func = data.func;
            this.wave = data.wave;
            this.instense = data.instense;
        }
    }
    get totalWidthmm() {
        return pb_1.Message.getField(this, 1) as number;
    }
    set totalWidthmm(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get has_totalWidthmm() {
        return pb_1.Message.getField(this, 1) != null;
    }
    get mm2px() {
        return pb_1.Message.getField(this, 2) as number;
    }
    set mm2px(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get has_mm2px() {
        return pb_1.Message.getField(this, 2) != null;
    }
    get totalWave() {
        return pb_1.Message.getField(this, 3) as number;
    }
    set totalWave(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get has_totalWave() {
        return pb_1.Message.getField(this, 3) != null;
    }
    get row() {
        return pb_1.Message.getField(this, 4) as number;
    }
    set row(value: number) {
        pb_1.Message.setField(this, 4, value);
    }
    get has_row() {
        return pb_1.Message.getField(this, 4) != null;
    }
    get func() {
        return pb_1.Message.getField(this, 5) as string;
    }
    set func(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get has_func() {
        return pb_1.Message.getField(this, 5) != null;
    }
    get wave() {
        return pb_1.Message.getFieldWithDefault(this, 6, []) as number[];
    }
    set wave(value: number[]) {
        pb_1.Message.setField(this, 6, value);
    }
    get instense() {
        return pb_1.Message.getFieldWithDefault(this, 7, []) as number[];
    }
    set instense(value: number[]) {
        pb_1.Message.setField(this, 7, value);
    }
    static fromObject(data: {
        totalWidthmm?: number;
        mm2px?: number;
        totalWave?: number;
        row?: number;
        func?: string;
        wave: number[];
        instense: number[];
    }): InfFastScreenBoard {
        const message = new InfFastScreenBoard({
            totalWidthmm: data.totalWidthmm,
            mm2px: data.mm2px,
            totalWave: data.totalWave,
            row: data.row,
            func: data.func,
            wave: data.wave,
            instense: data.instense
        });
        return message;
    }
    toObject() {
        const data: {
            totalWidthmm?: number;
            mm2px?: number;
            totalWave?: number;
            row?: number;
            func?: string;
            wave: number[];
            instense: number[];
        } = {
            wave: this.wave,
            instense: this.instense
        };
        if (this.totalWidthmm != null) {
            data.totalWidthmm = this.totalWidthmm;
        }
        if (this.mm2px != null) {
            data.mm2px = this.mm2px;
        }
        if (this.totalWave != null) {
            data.totalWave = this.totalWave;
        }
        if (this.row != null) {
            data.row = this.row;
        }
        if (this.func != null) {
            data.func = this.func;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_totalWidthmm)
            writer.writeInt32(1, this.totalWidthmm);
        if (this.has_mm2px)
            writer.writeInt32(2, this.mm2px);
        if (this.has_totalWave)
            writer.writeInt32(3, this.totalWave);
        if (this.has_row)
            writer.writeInt32(4, this.row);
        if (this.has_func && this.func.length)
            writer.writeString(5, this.func);
        if (this.wave.length)
            writer.writeRepeatedDouble(6, this.wave);
        if (this.instense.length)
            writer.writeRepeatedDouble(7, this.instense);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): InfFastScreenBoard {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new InfFastScreenBoard();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.totalWidthmm = reader.readInt32();
                    break;
                case 2:
                    message.mm2px = reader.readInt32();
                    break;
                case 3:
                    message.totalWave = reader.readInt32();
                    break;
                case 4:
                    message.row = reader.readInt32();
                    break;
                case 5:
                    message.func = reader.readString();
                    break;
                case 6:
                    pb_1.Message.addToRepeatedField(message, 6, reader.readDouble());
                    break;
                case 7:
                    pb_1.Message.addToRepeatedField(message, 7, reader.readDouble());
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): InfFastScreenBoard {
        return InfFastScreenBoard.deserialize(bytes);
    }
}
