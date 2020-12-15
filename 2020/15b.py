# JS console is having a very hard time running my logic,
# so I rewrote it in Python to ensure I was on the right track.
# Still trying to get JS to run the one-linerized code.

def run(input, turns):
    input = input.split(',')
    last = {int(n): i + 1 for (i, n) in enumerate(input)}
    spoken = int(input[-1])
    for turn in xrange(len(input), turns):
        new_spoken = turn - last[spoken] if spoken in last else 0
        last[spoken] = turn
        spoken = new_spoken
    return spoken

run('13,0,10,12,1,5,8', 30000000)
