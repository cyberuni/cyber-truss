# Q4: Retraction literature survey

Source types: primary = the paper or its authors' page; secondary = survey, wiki, blog, abstract page. Several primary PDFs could not be read as text (tooling returned compressed streams), so many claims rest on abstracts or secondary summaries. Those are marked. "Inference" means my reasoning, not a source claim.

## 1. Truth maintenance systems (Doyle JTMS 1979, de Kleer ATMS 1986)

- Doyle's paper is "A Truth Maintenance System", Artificial Intelligence 12(3), 251-272 (1979), also MIT AI Memo AIM-521. [IJCAI/search record via Wikipedia and MIT DSpace](https://en.wikipedia.org/wiki/Reason_maintenance) (secondary)
- JTMS keeps a dependency network: each node is a belief, each arc an inference step; premises need no justification. A node can have several justifications and is believed (IN) if at least one is valid. Justifications come in two types, support list (SL) and conditional proof (CP). [Reason maintenance](https://en.wikipedia.org/wiki/Reason_maintenance) (secondary)
- Retraction: beliefs are retracted automatically when their supporting assumptions are withdrawn. Contradictions trigger dependency-directed backtracking, which uses the network to find assumptions to retract. [From Doyle to AGM survey](https://arxiv.org/pdf/2608.14567) (secondary survey, read only the first 100k characters)
- ATMS (de Kleer, AI 28, 1986, pp. 127-162) labels each node with the sets of assumptions (environments) under which it holds. Nogoods are environments that lead to contradiction; every superset of a nogood is also nogood. [de Kleer, An Assumption-Based TMS](https://www.dekleer.org/Publications/An%20Assumption-Based%20TMS.pdf) (primary, not opened; claim from search snippets and the survey above)
- Because an ATMS precomputes consequences per assumption set, it avoids recomputing on context switch and supports what-if analysis, without backtracking. [From Doyle to AGM](https://arxiv.org/pdf/2608.14567) (secondary)
- Cost: ATMS has large overhead relative to JTMS, and labels can grow exponentially (2^n environments for n assumptions). [search summary of ATMS literature, Provan 1988 complexity analysis is listed in Wikipedia's references](https://en.wikipedia.org/wiki/Reason_maintenance) (secondary; the exponential-label claim came from search snippets, no single URL confirmed it)
- Failure modes: following justification chains can be inefficient, and chains can contain cycles. A non-monotonic JTMS must handle the more general case. [AAAI90-164](https://cdn.aaai.org/AAAI/1990/AAAI90-164.pdf) (primary-ish, surfaced in search but not opened; claim from the search summary)
- Wikipedia's page lists a "Circularity" slide topic in a TMS tutorial, but I could not read any statement on odd loops or well-founded support. [Tasso TMS slides index](https://users.dimi.uniud.it/~carlo.tasso/tms/index.htm) (secondary, table of contents only)
- Inference: the JTMS design is the closest to "retract everything derived from a replaced criterion", because the dependency network is exactly the record of what was derived from what. Circular justifications are the known hazard for any "retract if unsupported" rule: a cycle can keep its members IN with no grounded support. That hazard applies here only if criteria can derive each other cyclically across sets.

## 2. Incremental view maintenance in Datalog

- Gupta, Mumick, Subrahmanian, "Maintaining Views Incrementally", SIGMOD 1993, pp. 157-166. Counting tracks the number of derivations per tuple and cannot handle recursion. DRed (Delete and Rederive) handles recursive views; negation and aggregation are permitted. [Springer Professional record, DOI 10.1145/170035.170066](https://www.springerprofessional.de/doi/10.1145/170036.170066) (secondary bibliographic; algorithm details from search summary)
- DRed mechanics, stratum by stratum: (a) overdelete the explicit deletions and everything derivable from them, (b) for each overdeleted fact, look for an alternative derivation by evaluating rules backwards, (c) insert rederived facts and new consequences semi-naively. The backward step is the main inefficiency. [Optimised Maintenance of Datalog Materialisations, ar5iv](https://ar5iv.labs.arxiv.org/html/1711.03987) (primary, Hu/Motik/Horrocks)
- Counting fails on recursion because "recursive derivations can be cyclic": facts can support each other in a cycle, so a nonzero count does not prove the fact still holds. Same source (primary). This is the datalog form of the TMS circular-justification problem.
- DRed and B/F handle general (recursive) datalog; Counting only nonrecursive rules; hybrids (DRed^c, B/F^c) combine counting with them to cut backward evaluation. [arXiv 1711.03987 abstract](https://arxiv.org/abs/1711.03987) (primary abstract, via summarizer)
- Order and equality with recomputation: Theorem 1 of the hybrid paper states the algorithm correctly updates I = mat(Pi, E) to I' = mat(Pi, E'). So the result equals rematerialisation from scratch for the supported class. [ar5iv 1711.03987](https://ar5iv.labs.arxiv.org/html/1711.03987) (primary; I read only the first 100k of 167k characters)
- Negation: stratification requires a negatively used predicate to sit in a strictly lower stratum; maintenance goes stratum by stratum, so changes to negated facts from lower strata are fully known first. Same source (primary). The paper does not separately analyse negation inside the counter logic.
- Backward/Forward (Motik, Nenov, Piro, Horrocks, AAAI 2015) explores a deleted fact's support instead of its consequences; efficient when proof trees are shallow, reported sometimes faster than DRed and never significantly slower. Later work (AIJ 2019, "Maintenance of datalog materialisations revisited") covers counting, optimised DRed and FBF, for datalog with stratified negation. [Oxford paper PDF](https://www.cs.ox.ac.uk/boris.motik/pubs/mnph19maintenance-revisited.pdf) (primary, unreadable as text; claim from search summary). AAAI page returned access denied: [AAAI 9409](https://ojs.aaai.org/index.php/AAAI/article/view/9409).
- Differential dataflow (McSherry, Murray, Isaacs, Isard, CIDR 2013) extends incremental computation to arbitrarily nested iteration, and generalises a "difference" to allow multiple predecessor versions (partially ordered times). [MSR publication page](https://www.microsoft.com/en-us/research/publication/differential-dataflow/) (primary abstract). It handles retractions as negative-weight differences (inference; I found no source that states this explicitly).
- Inference on order independence: the correctness theorems say the maintained result equals mat(Pi, E'), a function only of the final input set. That is order-independent in the sense that two deletion sequences with the same final E' give the same I'. I did not find a source that states it as a named property.
- Inference, key caveat for us: all of this assumes derivation is a deterministic function (rules) of the facts. If derivation is an LLM call, mat(Pi, E') is not a function, so "equals recomputation" has no meaning.

## 3. Belief revision (AGM)

- Revision can be built from contraction then expansion (Levi identity): K * p = (K contract not-p) + p. The contraction step keeps the result consistent. [SEP Logic of Belief Revision](https://plato.stanford.edu/entries/logic-belief-revision/) (secondary, standard reference)
- "Replace criterion A with criterion B" where B contradicts A is a revision in the AGM sense: remove A (contract by not-B), add B. If B merely differs without logical conflict, AGM revision does not force removing A. (Inference.)
- AGM's key construction is partial meet contraction: intersect the best remainders chosen by a selection function. The recovery postulate holds in AGM belief sets but fails for belief bases. [SEP](https://plato.stanford.edu/entries/logic-belief-revision/) (secondary)
- Belief set (closed under consequence) vs belief base (not closed). In base models, derived beliefs "lack independent standing": one that loses support in basic beliefs is discarded. Hansson gave a representation theorem for base partial meet contraction and defined internal/external revision and semi-revision. Same source. This matches the proposal's "retract what was derived from the replaced criterion".
- The SEP says base vs set should not be equated with foundationalism vs coherentism, though it was often assumed. Same source. AGM theory-revision itself has no dependency record: in a closed belief set, what was derived is indistinguishable from what was asserted, so AGM alone says nothing about which derived beliefs survive. Base revision plus a derivation record (TMS-like) is what yields that. (Inference.)
- Under minimal change, AGM would keep unrelated derived beliefs and drop only what must go. That is a selection-function choice, which is a design decision, not a theorem. (Inference.)

## 4. Build systems (Build Systems a la Carte)

- Mokhov, Mitchell, Peyton Jones, ICFP 2018 (PACMPL 2, Art. 79), journal version JFP 30 (2020). Build systems vary along scheduler, rebuilder, early cutoff, self-tracking and persistent build information. [MSR publication page](https://www.microsoft.com/en-us/research/publication/build-systems-a-la-carte/) (primary)
- Minimality: "executes tasks at most once per build and only if they transitively depend on inputs that changed since the previous build"; tied to correctness defined in Sec. 3.6. [search summary of the paper](https://www.microsoft.com/en-us/research/uploads/prod/2020/04/build-systems-jfp.pdf) (primary, PDF unreadable; quotation as reproduced by search tool)
- Correctness: informally, the result equals rebuilding everything. The executable `build` library defines it as: result and store agree on inputs, and for every non-input key, recomputing its task matches the stored value. [Hackage build-0.0.1](https://hackage.haskell.org/package/build-0.0.1/docs/Build.html) (primary, code docs)
- Early cutoff: stop rebuilding downstream work when an intermediate output is unchanged. [Guix mailing list discussion](https://lists.gnu.org/r/guix-devel/2021-03/msg00581.html) (secondary, informal; the paper lists it as an axis)
- Correctness and minimality are stated as properties and, as far as I could see, built on the assumption that tasks are deterministic pure functions of their dependencies. Order-independence of the scheduler is not a theorem I could confirm. I did not read the verifying-trace or dirty-bit sections.
- "Forward Build Systems, Formally" (Spall, Mitchell, Tobin-Hochstadt, 2022) defines correctness as same results as running commands sequentially, and proves Rattle's optimisations preserve it, in Agda. [arXiv 2202.05328](https://arxiv.org/abs/2202.05328) (primary abstract). Authors named from memory of the paper, not from the fetched text.
- Inference: the build analogue of our case is an input edit. The "retract and rebuild" is rebuilding downstream keys; early cutoff is "if re-derivation produces the same criterion, stop propagating". That cutoff only works if comparison of outputs is cheap and rederivation is deterministic.

## 5. Epochs, versions, CALM

- CALM theorem: a program has a consistent, coordination-free distributed implementation if and only if it is monotonic (inputs S subset T implies output(S) subset output(T)). Non-monotonic operators (set difference, negated existentials, universal quantification, updates/deletes) are the source of the need for coordination, and non-monotonic programs are order-sensitive. [Hellerstein, Alvaro, Keeping CALM (ar5iv)](https://ar5iv.labs.arxiv.org/html/1901.01930) (primary)
- Placement: the paper recommends keeping coordination off the critical path, for example coordinating only at checkout in a shopping cart, with garbage collection and tombstone deletion lazy. It mentions global barriers (Bulk Synchronous Processing) as a mechanism, without detail on placement. Same source. It does not discuss stratified negation or "sealing" by name in this paper.
- Bloom certifies confluence by static analysis of monotone code, and uses CRDT-like lattices. Same source.
- LVars (Kuper, Newton): writes are monotonic least-upper-bound updates; reads are threshold reads that block until a lower bound is reached, which keeps determinism. [FHPC 2013 summary](https://tagteam.harvard.edu/hub_feeds/1936/feed_items/287306) (secondary). Adding freeze (read the exact value) gives quasi-determinism: the same answer or an error; a write after freeze raises an exception. [Freeze After Writing, POPL 2014](https://www.cl.cam.ac.uk/~nk480/lvish-popl.pdf) (primary, not opened; from search summary)
- Inference, fit: freeze is the closest formal match to "a version boundary". Within a version, monotone union is confluent; at the boundary, you freeze the old version's set and a later write that would have changed it is an error. CALM matches "coordinate at non-monotone points", but CALM's coordination is about distributed replicas agreeing on a total order or a complete input, not about a human decision. A recorded decision at the boundary plays the role of the coordination step: it fixes the input set that the new epoch starts from. This is my mapping, not a claim in the paper.
- Bloom^L: not verified (no source fetched).

## 6. Synthesis (inference throughout)

1. Best model for "replacement starts a new version, retracts derived criteria": a base-revision view (AGM base revision, Hansson) executed with JTMS-style dependency records, with CALM/LVars-freeze as the justification for confining non-monotonic change to version boundaries. DRed is the right precedent for the retraction step's correctness shape (over-delete, then rederive what has other support), but its equals-recomputation theorem needs deterministic derivation.
2. With an LLM deriving criteria, justification tracking fits better than DRed's rederive step. DRed needs to ask "does this fact still have another derivation?", which means rerunning derivations, expensive and non-deterministic. A TMS record of "criterion X was derived from {A, B}" answers that from the record, with no LLM call. DRed's over-delete half is the same as "retract everything derived from the replaced criterion" and is exactly the proposal.
3. Trade-off, precision vs bookkeeping: transitive retraction through the dependency record is precise but requires every derivation to log its premises. Over-deleting is cheap to record but throws away criteria that did not actually depend on the old one, then rederivation may produce different text. The proposal's blanket retraction is the cautious, over-deleting end.
4. Risk: rederivation yields different criteria. Plain DRed's guarantee does not carry over. Mitigations that the literature suggests: early cutoff (compare rederived criterion to the retracted one and stop if equal), and keeping the retracted criterion as a candidate for the human or recorded decision at the version boundary.
5. Circularity: a TMS-style "retract if no valid support" needs well-founded support; the datalog work shows counting breaks on cycles. If criteria can derive from each other across sets, prefer retraction from the replaced criterion outward over counting supports.
6. Most relevant result: Hu, Motik, Horrocks, Theorem 1 plus Algorithm 1 (DRed with counters): correct incremental maintenance equals rematerialisation from the new input. Our proposal is an LLM-driven analogue whose correctness cannot be stated that way, so the version boundary has to fix the input set explicitly.

## Evidence table

| id | claim | confidence | URL | type |
|---|---|---|---|---|
| E21 | Doyle's TMS paper: AI 12(3) 251-272, 1979, MIT AIM-521 | high | https://en.wikipedia.org/wiki/Reason_maintenance | secondary |
| E22 | JTMS: dependency network, node IN if some justification valid; SL and CP justifications | medium | https://en.wikipedia.org/wiki/Reason_maintenance | secondary |
| E23 | TMS retracts beliefs automatically when supporting assumptions withdrawn; dependency-directed backtracking | medium | https://arxiv.org/pdf/2608.14567 | secondary |
| E24 | ATMS labels nodes with assumption environments; nogoods closed under supersets | medium | https://www.dekleer.org/Publications/An%20Assumption-Based%20TMS.pdf | primary, unread |
| E25 | ATMS overhead and label growth exponential in assumptions | low | https://www.dekleer.org/Publications/An%20Assumption-Based%20TMS.pdf | search snippets only |
| E26 | JTMS justification chains can contain cycles and following them is inefficient | low | https://cdn.aaai.org/AAAI/1990/AAAI90-164.pdf | search summary only |
| E27 | Counting handles only nonrecursive rules; DRed and B/F handle general datalog | high | https://arxiv.org/abs/1711.03987 | primary abstract |
| E28 | Counting fails on recursion because recursive derivations can be cyclic | high | https://ar5iv.labs.arxiv.org/html/1711.03987 | primary |
| E29 | DRed = overdelete, one-step backward rederive, then insert; backward step is main inefficiency | high | https://ar5iv.labs.arxiv.org/html/1711.03987 | primary |
| E30 | Hybrid DRed^c result equals mat(Pi, E') (Theorem 1) | high | https://ar5iv.labs.arxiv.org/html/1711.03987 | primary |
| E31 | Stratified negation handled stratum by stratum in maintenance | medium | https://ar5iv.labs.arxiv.org/html/1711.03987 | primary |
| E32 | B/F explores support not consequences; efficient for shallow proof trees; FBF in AIJ 2019 | medium | https://www.cs.ox.ac.uk/boris.motik/pubs/mnph19maintenance-revisited.pdf | primary, unreadable; summary |
| E33 | Gupta/Mumick/Subrahmanian SIGMOD 1993 introduced counting and DRed | medium | https://www.springerprofessional.de/doi/10.1145/170036.170066 | secondary |
| E34 | Differential dataflow generalises incremental computation to nested iteration, partially ordered versions | medium | https://www.microsoft.com/en-us/research/publication/differential-dataflow/ | primary abstract |
| E35 | Levi identity: revision = contraction by not-p then expansion | high | https://plato.stanford.edu/entries/logic-belief-revision/ | secondary |
| E36 | In base models derived beliefs lose standing when support is lost; recovery fails for bases | high | https://plato.stanford.edu/entries/logic-belief-revision/ | secondary |
| E37 | Base/set distinction should not be equated with foundationalism/coherentism | high | https://plato.stanford.edu/entries/logic-belief-revision/ | secondary |
| E38 | Hansson: base partial meet contraction, consolidation, internal/external revision, semi-revision | medium | https://plato.stanford.edu/entries/logic-belief-revision/ | secondary |
| E39 | BSALC minimality: tasks run at most once, only if transitive inputs changed | medium | https://www.microsoft.com/en-us/research/uploads/prod/2020/04/build-systems-jfp.pdf | primary, via search summary |
| E40 | Correctness: stored results match recomputation of each non-input task | high | https://hackage.haskell.org/package/build-0.0.1/docs/Build.html | primary code docs |
| E41 | Early cutoff stops downstream rebuild when output unchanged | medium | https://lists.gnu.org/r/guix-devel/2021-03/msg00581.html | secondary |
| E42 | Forward Build Systems, Formally: correctness = same as sequential run; Rattle optimisations proven in Agda | medium | https://arxiv.org/abs/2202.05328 | primary abstract |
| E43 | CALM: coordination-free consistent implementation iff monotonic | high | https://ar5iv.labs.arxiv.org/html/1901.01930 | primary |
| E44 | Non-monotonic operators (difference, negated existentials, deletes) cause need for coordination; non-monotonic programs are order-sensitive | high | https://ar5iv.labs.arxiv.org/html/1901.01930 | primary |
| E45 | CALM paper keeps coordination off the critical path (e.g. checkout only); mentions barriers | medium | https://ar5iv.labs.arxiv.org/html/1901.01930 | primary |
| E46 | LVars: monotonic lub writes, threshold reads, deterministic | medium | https://tagteam.harvard.edu/hub_feeds/1936/feed_items/287306 | secondary |
| E47 | Freeze after writing: quasi-determinism, write-after-freeze error | medium | https://www.cl.cam.ac.uk/~nk480/lvish-popl.pdf | primary, via search summary |

## Could not verify

- Doyle's 1979 paper text itself, and any primary statement of odd loops or well-founded support in the JTMS. Not found in any fetched source.
- de Kleer 1986 details (labels, nogoods, cost): the PDF was not opened; claims come from search snippets.
- Provan 1988 complexity result for ATMS (listed in Wikipedia references, not read).
- Motik et al. 2015/2019 text: PDFs were unreadable and the AAAI page was access denied; guarantees for B/F and FBF rest on abstracts and the hybrid paper.
- Gupta et al. 1993 treatment of stratified negation in DRed.
- Any source explicitly stating DRed or counting are order-independent over update sequences, or that differential dataflow models retractions as negative multiplicities.
- BSALC: the Section 3.6 correctness definition text, verifying traces, dirty bit, and any scheduler-independence theorem.
- Bloom^L lattices paper, Hellerstein's treatment of stratified negation as a coordination point, and any formal treatment of "epochs" beyond LVars freeze.
- AGM postulates read directly from the 1985 paper; only SEP was used. SEP's full text past 100k characters was not read.
- The survey "From Doyle to AGM" (arxiv 2608.14567): read through the first 100k characters only; its claims are secondary.
