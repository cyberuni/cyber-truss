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
    And a second provider declaring the state, views and actions contracts at supported versions
    When the host loads each of them
    Then both bindings carry the same set of fields
    And each binding lists exactly the contracts its provider declared

  # ── refreshState ──

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

  Scenario: facts from two providers keep their own provenance in one view
    Given a bound fleet provider that has reported a completed pod
    And a bound sdd provider that has reported a passed gate
    When the host composes both snapshots into one view
    Then the completed pod names the fleet provider as its provenance
    And the passed gate names the sdd provider as its provenance

  # ── dispatchAction ──

  Scenario: no action control is offered for a binding without the actions contract
    Given a binding that lists the state contract only
    When the host is asked what actions that binding offers
    Then it reports an empty set of actions

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

  Scenario: answering a decision returns the answer to the domain and records no host approval
    Given a binding whose provider has reported a decision awaiting an answer
    When a Council member answers that decision in the host
    Then the answer is dispatched to that provider as an action
    And the host stores no approval of its own for that decision

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
