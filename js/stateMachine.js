class StateMachine {
  constructor(json) {
    this.table = json;
    this.currentState = this.table["initialState"];
    this.lastOutput = undefined;
  }

  nextState(stimulus) {
    if (undefined != this.table[this.currentState][stimulus]) {
      this.lastOutput = this.table[this.currentState][stimulus][1];
      this.currentState = this.table[this.currentState][stimulus][0];
      return this.lastOutput;
    }
    else if (undefined != this.table[this.currentState]["catch"]) {
        this.lastOutput = this.table[this.currentState]["catch"][1];
        this.currentState = this.table[this.currentState]["catch"][0];
        return this.lastOutput;
    }
    else {
      return null;
    }
  }

  repeat() {
    return this.lastOutput;
  }
}
