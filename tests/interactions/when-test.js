/* global describe, beforeEach, afterEach, it */
import { expect } from 'chai';
import { useFixture } from '../helpers';
import { interactor, when, hasClass } from '../../src';

const WhenInteractor = interactor(function() {
  this.isLoading = hasClass('is-loading');
  this.whenLoading = when('isLoading');
  this.doneLoading = when('!isLoading');
});

describe('BigTest Interaction: when', () => {
  let timeout, test;

  useFixture('click-fixture');

  beforeEach(() => {
    let $btn = document.querySelector('.test-btn');

    timeout = setTimeout(() => {
      $btn.classList.add('is-loading');

      timeout = setTimeout(() => {
        $btn.classList.remove('is-loading');
      }, 50);
    }, 50);

    test = new WhenInteractor({
      scope: '.test-btn',
      timeout: 100
    });
  });

  afterEach(() => {
    clearTimeout(timeout);
  });

  it('has when methods', () => {
    expect(test).to.respondTo('when');
    expect(test).to.respondTo('whenLoading');
    expect(test).to.respondTo('doneLoading');
  });

  it('returns a new instance', () => {
    expect(test.when('isLoading')).to.not.equal(test);
    expect(test.when('isLoading')).to.be.an.instanceof(WhenInteractor);
    expect(test.whenLoading()).to.not.equal(test);
    expect(test.whenLoading()).to.be.an.instanceof(WhenInteractor);
    expect(test.when('!isLoading')).to.not.equal(test);
    expect(test.when('!isLoading')).to.be.an.instanceof(WhenInteractor);
    expect(test.doneLoading()).to.not.equal(test);
    expect(test.doneLoading()).to.be.an.instanceof(WhenInteractor);
  });

  it('continues when the condition passes', async () => {
    expect(test.isLoading).to.be.false;
    await expect(test.when('isLoading').run()).to.be.fulfilled;
    expect(test.isLoading).to.be.true;
    await expect(test.when('!isLoading').run()).to.be.fulfilled;
    expect(test.isLoading).to.be.false;
  });

  it('continues when the custom condition passes', async () => {
    expect(test.isLoading).to.be.false;
    await expect(test.whenLoading().run()).to.be.fulfilled;
    expect(test.isLoading).to.be.true;
    await expect(test.doneLoading().run()).to.be.fulfilled;
    expect(test.isLoading).to.be.false;
  });

  it('throws when the condition fails', async () => {
    clearTimeout(timeout);

    await expect(test.when('isLoading').run())
      .to.be.rejectedWith('isLoading returned false');

    test.$root.classList.add('is-loading');
    await expect(test.when('!isLoading').run())
      .to.be.rejectedWith('isLoading returned true');
  });

  it('throws when the custom condition fails', async () => {
    clearTimeout(timeout);

    await expect(test.whenLoading().run())
      .to.be.rejectedWith('isLoading returned false');

    test.$root.classList.add('is-loading');
    await expect(test.doneLoading().run())
      .to.be.rejectedWith('isLoading returned true');
  });
});
