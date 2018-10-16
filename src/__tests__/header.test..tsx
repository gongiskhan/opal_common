import * as React from "react";
import {shallow} from "enzyme";
import {Header} from "../components/header";

describe('components/header.tsx', () => {
  it("renders the Header properly", () => {
    expect(shallow(<Header message={'Test'}/>).find('.opal-header')).toHaveLength(1);
  });
});
