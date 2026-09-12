Feature: Provider exchange

  Following a fact into the domain that owns it, and asking a domain to do something it
  owns -- including the guarantee that an action whose outcome is unknown is never sent a
  second time.

  # ── resolveReference ──

  Scenario: a reference into another domain resolves through that domain's binding
    Given a bound sdd provider that recognizes a mission identifier
    And a fleet snapshot carrying a reference to that mission identifier
    When the host resolves that reference
    Then the resolution is resolved
    And the resolution names the sdd provider as its provenance

  Scenario: a reference into an unbound domain is reported unresolved
    Given a fleet snapshot carrying a reference into the truss domain
    And no truss provider is bound
    When the host resolves that reference
    Then the resolution is unresolved
    And the resolution gives its reason as no provider

  Scenario: resolving through a binding without the references contract reports nothing to resolve
    Given a bound sdd provider whose binding lists the state contract only
    And a fleet snapshot carrying a reference into the sdd domain
    When the host resolves that reference
    Then it reports nothing to resolve
    And it sends no request to that provider

  Scenario: a reference the target domain does not recognize is reported unresolved
    Given a bound truss provider that recognizes no obligation identifier
    And a fleet snapshot carrying a reference to an obligation identifier
    When the host resolves that reference
    Then the resolution is unresolved
    And the resolution gives its reason as unknown identifier

  # ── dispatchAction ──

  Scenario: dispatching on a binding without the actions contract reports no such contract
    Given a binding that lists the state contract only
    When the host dispatches an action on that binding
    Then it reports no such contract
    And it sends no request to that provider

  Scenario: an action the domain accepts returns its result with the domain as provenance
    Given a binding listing the actions contract
    And its provider accepts an action it is sent
    When the host dispatches that action
    Then the outcome is a result
    And the outcome names that provider as its provenance

  Scenario: an action the domain refuses surfaces the domain's error and is not retried
    Given a binding listing the actions contract
    And its provider refuses an action it is sent
    When the host dispatches that action
    Then the outcome is a domain error
    And the error text is the one the provider returned
    And the host sends that action identifier once

  Scenario: an action in flight across a provider restart is reported unknown and never re-dispatched
    Given a binding listing the actions contract
    And its provider restarts after receiving an action and before returning an outcome
    When the host observes the restart
    Then the outcome is unknown
    And the host sends that action identifier once

  Scenario: a decision stays as its provider last reported it until that provider reports otherwise
    Given a binding whose provider has reported a decision awaiting an answer
    And its provider accepts an action it is sent
    When the host dispatches an answer for that decision
    Then the answer is delivered to that provider as an action
    And refreshing that binding still reports the decision as awaiting an answer

  Scenario: an action in flight when its provider is unloaded is reported unknown and never re-dispatched
    Given a binding listing the actions contract
    And its provider has received an action and returned no outcome
    When the host unloads that binding
    Then that provider's process is no longer running
    And the outcome is unknown
    And the host sends that action identifier once
