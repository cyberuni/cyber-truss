Feature: Provider binding

  Finding a provider, binding the capability contracts it declares at versions the host
  supports, holding the snapshots it reports without ever promoting one, and releasing it.
  Everything here has running code behind it.

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

  Scenario: refusing one provider still binds another loaded in the same pass
    Given a provider whose only contract is at a version the host does not support
    And a second provider declaring the state contract at a version the host supports
    When the host loads both
    Then the second returns a binding

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

  Scenario: one provider's exit does not make another provider's snapshot stale
    Given a bound fleet provider whose process has exited
    And a bound sdd provider that has reported a snapshot
    When the host refreshes the sdd binding
    Then the sdd snapshot is marked live

  Scenario: facts from three domains keep their own provenance when held together
    Given a bound fleet provider that has reported a completed pod
    And a bound sdd provider that has reported a passed gate
    And a bound truss provider that has reported a resolved obligation
    When the host holds all three snapshots
    Then the completed pod names the fleet provider as its provenance
    And the passed gate names the sdd provider as its provenance
    And the resolved obligation names the truss provider as its provenance

  # ── unloadIntegration ──

  Scenario: unloading a provider releases its process and retains no snapshot
    Given a bound provider that has reported a snapshot
    When the host unloads it
    Then that provider's process is no longer running
    And the host holds no snapshot for that provider
