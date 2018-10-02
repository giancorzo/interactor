/* global describe, beforeEach, afterEach, it */
import { expect } from 'chai';
import { useFixture } from '../helpers';
import { interactor, always, hasClass } from '../../src';

const AlwaysInteractor = interactor(function() {
  this.isLoading = hasClass('is-loading');
  this.beenLoading = always('isLoading');
  this.notLoading = always('!isLoading');
});

describe('BigTest Interaction: always', () => {
  let timeout, test;

  useFixture('click-fixture');

  beforeEach(() => {
    let $btn = document.querySelector('.test-btn');

    timeout = setTimeout(() => {
      $btn.classList.add('is-loading');

      timeout = setTimeout(() => {
        $btn.classList.remove('is-loading');
      }, 100);
    }, 50);

    test = new AlwaysInteractor({
      scope: '.test-btn',
      timeout: 70
    });
  });

  afterEach(() => {
    clearTimeout(timeout);
  });

  it('has always methods', () => {
    expect(test).to.respondTo('always');
    expect(test).to.respondTo('beenLoading');
    expect(test).to.respondTo('notLoading');
  });

  it('returns a new instance', () => {
    expect(test.always('isLoading')).to.not.equal(test);
    expect(test.always('isLoading')).to.be.an.instanceof(AlwaysInteractor);
    expect(test.beenLoading()).to.not.equal(test);
    expect(test.beenLoading()).to.be.an.instanceof(AlwaysInteractor);
    expect(test.always('!isLoading')).to.not.equal(test);
    expect(test.always('!isLoading')).to.be.an.instanceof(AlwaysInteractor);
    expect(test.notLoading()).to.not.equal(test);
    expect(test.notLoading()).to.be.an.instanceof(AlwaysInteractor);
  });

  it('continues after the condition passes', async () => {
    await test.when('isLoading');
    await expect(test.always('isLoading').run()).to.be.fulfilled;
    await test.when('!isLoading');
    await expect(test.always('!isLoading').run()).to.be.fulfilled;
  });

  it('continues when the custom condition passes', async () => {
    await test.when('isLoading');
    await expect(test.beenLoading().run()).to.be.fulfilled;
    await test.when('!isLoading');
    await expect(test.notLoading().run()).to.be.fulfilled;
  });

  it('throws when the condition fails', async () => {
    clearTimeout(timeout);

    await expect(test.always('isLoading').run())
      .to.be.rejectedWith('isLoading returned false');

    test.$root.classList.add('is-loading');
    await expect(test.always('!isLoading').run())
      .to.be.rejectedWith('isLoading returned true');
  });

  it('throws when the custom condition fails', async () => {
    clearTimeout(timeout);

    await expect(test.beenLoading().run())
      .to.be.rejectedWith('isLoading returned false');

    test.$root.classList.add('is-loading');
    await expect(test.notLoading().run())
      .to.be.rejectedWith('isLoading returned true');
  });
});
