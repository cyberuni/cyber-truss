Feature: Extension contract

  Command Center binds to out-of-process providers through a set of segregated
  capability contracts, holds snapshots it never promotes on its own, and dispatches
  domain-owned actions that are never sent twice.

  # ── discoverIntegrations ──

  Scenario: discovery in a directory with no provider reports zero integrations
    Given an empty project directory
    When the host discovers integrations there
    Then it reports an empty set of provider manifests
    And it reports no error

  Scenario: discovery reports every provider manifest it finds
    Given a project directory containing a fleet provider manifest
    And the same directory contains an sdd provider manifest
    When the host discovers integrations there
    Then it reports both provider manifests

  # ── loadIntegration ──

  Scenario: a provider whose contracts are all compatible binds with all of them
    Given a provider declaring the state contract at a version the host supports
    And the same provider declares the actions contract at a version the host supports
    When the host loads it
    Then it returns a binding
    And the binding lists the state contract
    And the binding lists the actions contract

  Scenario: a provider with one incompatible contract binds without it
    Given a provider declaring the state contract at a version the host supports
    And the same provider declares the actions contract at a version the host does not support
    When the host loads it
    Then it returns a binding
    And the binding lists the state contract
    And the binding omits the actions contract
    And the binding names the actions contract as unavailable for a version mismatch

  Scenario: a provider with no compatible contract is refused as a version mismatch
    Given a provider declaring the state contract at a version the host does not support
    When the host loads it
    Then it returns an unavailable state
    And the unavailable state gives its reason as a version mismatch
    And the provider process is not left running

  Scenario: a provider that does not start is reported unavailable, not absent
    Given a provider manifest naming a command that exits before completing the handshake
    When the host loads it
    Then it returns an unavailable state
    And the unavailable state gives its reason as not started
    And the provider appears in the host's list of integrations

  Scenario: a provider declaring no capability contract is refused
    Given a provider that completes the handshake and declares an empty contract list
    When the host loads it
    Then it returns an unavailable state
    And the unavailable state gives its reason as no contracts

  Scenario: the binding envelope does not vary with the declared subset
    Given a provider declaring only the state contract at a supported version
    And a second provider declaring the state, references and actions contracts at supported versions
    When the host loads each of them
    Then both bindings carry the same set of fields
    And each binding lists exactly the contracts its provider declared

  # ── refreshState ──

  Scenario: refreshing a contract absent from the binding reports nothing to refresh
    Given a binding that lists the state contract only
    When the host refreshes the actions contract on that binding
    Then it reports nothing to refresh
    And it sends no request to that provider

  Scenario: a reported snapshot is rendered live and carries its provider as provenance
    Given a bound provider that has reported a snapshot
    When the host refreshes its state
    Then the snapshot is marked live
    And the snapshot names that provider as its provenance

  Scenario: a snapshot from an exited provider is kept and marked stale
    Given a bound provider that has reported a snapshot
    And that provider's process has since exited
    When the host refreshes its state
    Then the snapshot from before the exit is still returned
    And the snapshot is marked stale

  Scenario: a restart alone never promotes a stale snapshot to live
    Given a bound provider whose snapshot is marked stale
    And that provider's process has restarted and reported nothing since
    When the host refreshes its state
    Then the snapshot is still marked stale

  Scenario: facts from three domains keep their own provenance when held together
    Given a bound fleet provider that has reported a completed pod
    And a bound sdd provider that has reported a passed gate
    And a bound truss provider that has reported a resolved obligation
    When the host holds all three snapshots
    Then the completed pod names the fleet provider as its provenance
    And the passed gate names the sdd provider as its provenance
    And the resolved obligation names the truss provider as its provenance

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

  # ── unloadIntegration ──

  Scenario: unloading a provider releases its process and retains no snapshot
    Given a bound provider that has reported a snapshot
    When the host unloads it
    Then that provider's process is no longer running
    And the host holds no snapshot for that provider

  Scenario: unloading with an action in flight completes and reports the outcome unknown
    Given a binding listing the actions contract
    And its provider has received an action and returned no outcome
    When the host unloads that binding
    Then that provider's process is no longer running
    And the outcome is unknown
    And the host sends that action identifier once
