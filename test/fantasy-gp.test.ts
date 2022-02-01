import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as FantasyGp from '../lib/fantasy-gp-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new FantasyGp.FantasyGpStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
