---------------------------- MODULE blablamovie ----------------------------

(***************************************************************************)
(* Users vote for a 1..3 Movies during one week.                           *)
(* After the week, the most voted Movie is displayed.                      *)
(***************************************************************************)

EXTENDS Integers, FiniteSets

PT == INSTANCE PT

CONSTANTS MOVIES, VOTE_DURATION, USERS
ASSUME MOVIES \subseteq Int
ASSUME \A m \in MOVIES: m >= 0
ASSUME USERS \subseteq Int
ASSUME VOTE_DURATION \in Int
ASSUME VOTE_DURATION > 0

MoviesVotes ==
    [MOVIES -> SUBSET USERS]

(* --algorithm ElectionOfMovie

variables
    days_left \in 1..VOTE_DURATION,
    movies_votes = [m \in MOVIES |-> {}],
    winner = -1;

define
    TotalVoted ==
        PT!ReduceSet(
            LAMBDA m, acc: acc + Cardinality(movies_votes[m]),
            DOMAIN movies_votes, 0)
    
    TotalVotedOf(movie) ==
        Cardinality(movies_votes[movie])
    
    HasMovieToVote(user) ==
        \E m \in MOVIES: user \notin movies_votes[m]
    
    ChooseNotVotedMovies(n, user) ==
        PT!ReduceSet(
            LAMBDA i, acc: IF HasMovieToVote(user)
                THEN acc \union {
                    CHOOSE m \in MOVIES: 
                        m \notin acc /\ user \notin movies_votes[m]}
                ELSE acc,
            1..n, {})
    
    NumberOfMoviesToVote(user) ==
        Cardinality(PT!ReduceSet(
            LAMBDA m, acc: IF user \notin movies_votes[m]
                THEN acc \union {m}
                ELSE acc,
            MOVIES, {}))
    
    Winner == CHOOSE m \in MOVIES: \A m2 \in (MOVIES \ {m}): 
        TotalVotedOf(m) >= TotalVotedOf(m2)
end define;

fair process User \in USERS
variable votesLeft = 3;
begin Loop:
    while days_left > 0 /\ votesLeft > 0
    do
        with numberOfVotes \in 1..PT!Min(NumberOfMoviesToVote(self), votesLeft),
             moviesToVote = ChooseNotVotedMovies(numberOfVotes, self)
        do
            movies_votes := PT!ReduceSet(
                LAMBDA m, acc: [acc EXCEPT 
                    ![m] = acc[m] \union {self}],
                moviesToVote, movies_votes);
            votesLeft := votesLeft - numberOfVotes;
        end with;
        
        days_left := days_left - 1;
    end while;
    
    DisplayWinner:
        winner := Winner;
end process;
end algorithm;
*)
\* BEGIN TRANSLATION (chksum(pcal) = "7294aa2a" /\ chksum(tla) = "dbee08ab")
VARIABLES days_left, movies_votes, winner, pc

(* define statement *)
TotalVoted ==
    PT!ReduceSet(
        LAMBDA m, acc: acc + Cardinality(movies_votes[m]),
        DOMAIN movies_votes, 0)

TotalVotedOf(movie) ==
    Cardinality(movies_votes[movie])

HasMovieToVote(user) ==
    \E m \in MOVIES: user \notin movies_votes[m]

ChooseNotVotedMovies(n, user) ==
    PT!ReduceSet(
        LAMBDA i, acc: IF HasMovieToVote(user)
            THEN acc \union {
                CHOOSE m \in MOVIES:
                    m \notin acc /\ user \notin movies_votes[m]}
            ELSE acc,
        1..n, {})

NumberOfMoviesToVote(user) ==
    Cardinality(PT!ReduceSet(
        LAMBDA m, acc: IF user \notin movies_votes[m]
            THEN acc \union {m}
            ELSE acc,
        MOVIES, {}))

Winner == CHOOSE m \in MOVIES: \A m2 \in (MOVIES \ {m}):
    TotalVotedOf(m) >= TotalVotedOf(m2)

VARIABLE votesLeft

vars == << days_left, movies_votes, winner, pc, votesLeft >>

ProcSet == (USERS)

Init == (* Global variables *)
        /\ days_left \in 1..VOTE_DURATION
        /\ movies_votes = [m \in MOVIES |-> {}]
        /\ winner = -1
        (* Process User *)
        /\ votesLeft = [self \in USERS |-> 3]
        /\ pc = [self \in ProcSet |-> "Loop"]

Loop(self) == /\ pc[self] = "Loop"
              /\ IF days_left > 0 /\ votesLeft[self] > 0
                    THEN /\ \E numberOfVotes \in 1..PT!Min(NumberOfMoviesToVote(self), votesLeft[self]):
                              LET moviesToVote == ChooseNotVotedMovies(numberOfVotes, self) IN
                                /\ movies_votes' =             PT!ReduceSet(
                                                   LAMBDA m, acc: [acc EXCEPT
                                                       ![m] = acc[m] \union {self}],
                                                   moviesToVote, movies_votes)
                                /\ votesLeft' = [votesLeft EXCEPT ![self] = votesLeft[self] - numberOfVotes]
                         /\ days_left' = days_left - 1
                         /\ pc' = [pc EXCEPT ![self] = "Loop"]
                    ELSE /\ pc' = [pc EXCEPT ![self] = "DisplayWinner"]
                         /\ UNCHANGED << days_left, movies_votes, votesLeft >>
              /\ UNCHANGED winner

DisplayWinner(self) == /\ pc[self] = "DisplayWinner"
                       /\ winner' = Winner
                       /\ pc' = [pc EXCEPT ![self] = "Done"]
                       /\ UNCHANGED << days_left, movies_votes, votesLeft >>

User(self) == Loop(self) \/ DisplayWinner(self)

(* Allow infinite stuttering to prevent deadlock on termination. *)
Terminating == /\ \A self \in ProcSet: pc[self] = "Done"
               /\ UNCHANGED vars

Next == (\E self \in USERS: User(self))
           \/ Terminating

Spec == /\ Init /\ [][Next]_vars
        /\ \A self \in USERS : WF_vars(User(self))

Termination == <>(\A self \in ProcSet: pc[self] = "Done")

\* END TRANSLATION 

SumVotesLeft ==
    PT!ReduceSeq(
        LAMBDA i, acc: acc + i,
        votesLeft, 0)

TypeOK ==
    /\ movies_votes \in MoviesVotes
    /\ days_left \in 0..VOTE_DURATION
    /\ \A u \in USERS: votesLeft[u] \in 0..3
    /\ winner = -1 \/ winner \in MOVIES

Invariants ==
    /\ TotalVoted = (Cardinality(USERS) * 3) - SumVotesLeft

WinnerIsFound ==
    <>(winner \in MOVIES)

=============================================================================
\* Modification History
\* Last modified Thu Mar 25 10:45:43 CET 2021 by davd
\* Created Wed Mar 24 12:26:25 CET 2021 by davd
