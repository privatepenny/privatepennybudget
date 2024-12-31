import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

const Goals = () => {
  const { user } = useAuthContext();
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [name, setName] = useState('');
  const [amountGoal, setAmountGoal] = useState('');
  const [amountActual, setAmountActual] = useState('');

  // Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/goals', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error || 'Failed to fetch goals.');
        } else {
          setGoals(json);
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  // Handle delete
  const handleDelete = async (id) => {
    if (!user) {
      setError('You must be logged in.');
      return;
    }

    try {
      const response = await fetch(`/goals/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const json = await response.json();
        setError(json.error || 'Failed to delete goal.');
        return;
      }

      setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== id));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (id, name, amountGoal) => {
    setEditingGoalId(id);
    setEditName(name);
    setEditAmount(amountGoal);
  };

  const handleSaveEdit = async () => {
    if (!user) {
      setError('You must be logged in.');
      return;
    }

    const updatedGoal = { name: editName, amountGoal: editAmount };

    try {
      const response = await fetch(`/goals/${editingGoalId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedGoal),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || 'Failed to update goal.');
        return;
      }

      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === editingGoalId ? { ...goal, ...updatedGoal } : goal
        )
      );

      setEditingGoalId(null);
      setEditName('');
      setEditAmount('');
      setError(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // Handle create
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in.');
      return;
    }

    const saving = { name, amountGoal, amountActual };

    try {
      const response = await fetch('/goals', {
        method: 'POST',
        body: JSON.stringify(saving),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setGoals((prevGoals) => [...prevGoals, json]);
        setName('');
        setAmountGoal('');
        setAmountActual('');
        setError(null);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return <p className="text-center text-bodyTextDark">Loading goals...</p>;
  }

  if (error) {
    return <p className="text-center text-warningColor">{error}</p>;
  }

  return (
    <div className="max-w-sm m-2 overflow-y-auto h-[calc(100vh-96px)]">
      <h3 className="text-xl font-bold mb-4 text-bodyTextDark text-center">Your Savings Goals</h3>
      {goals.length === 0 ? (
        <p className="text-bodyTextDark">No goals found. Start by creating a new goal.</p>
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li
              key={goal._id}
              className="text-sm flex flex-col bg-light3 text-bodyTextDark p-2 rounded-md shadow space-y-2"
            >
              <div className="flex items-center justify-between">
                {editingGoalId === goal._id ? (
                  <div className="flex items-center space-x-4 flex-grow">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 w-28 p-px bg-formInput rounded-md"
                    />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-14 p-px bg-formInput rounded-md"
                    />
                  </div>
                ) : (
                  <span className="flex-grow flex justify-between items-center">
                    <span className="font-bold">{goal.name}</span>
                    <span className="text-right ml-2">${goal.amountGoal}</span>
                  </span>
                )}

                {editingGoalId === goal._id ? (
                  <button
                    onClick={handleSaveEdit}
                    className="bg-button2 hover:bg-buttonHover2 text-bodyTextLight p-px rounded-md ml-4 material-symbols-outlined"
                  >
                    check
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(goal._id, goal.name, goal.amountGoal)}
                    className="bg-button2 hover:bg-buttonHover2 text-bodyTextLight p-px rounded-md ml-4 material-symbols-outlined"
                  >
                    edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(goal._id)}
                  className="bg-warningColor text-warningText p-px rounded-md ml-2 material-symbols-outlined"
                >
                  delete
                </button>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-4 bg-progressBar rounded-md overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-dark3"
                  style={{
                    width: `${(goal.amountActual / goal.amountGoal) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-bodyTextDark text-center">
                ${goal.amountActual} saved!{' '}
                {Math.min(
                  ((goal.amountActual / goal.amountGoal) * 100).toFixed(2),
                  100
                )}
                % of goal achieved.
              </p>
            </li>
          ))}
        </ul>
      )}

      <hr className='border-t-2 border-dark1 my-2'/>

      {/* Create Goal Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full text-sm"
      >
        <h2 className="font-semibold mb-1 text-bodyTextDark text-center">Create A New Goal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Line: Name and Goal Amount */}
          <div className="flex flex-col">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="p-px border border-dark1 rounded-md bg-light1 text-bodyTextDark"
              placeholder="Name"
              required
            />
          </div>

          <div className="flex flex-col">
            <input
              type="number"
              onChange={(e) => setAmountGoal(e.target.value)}
              value={amountGoal}
              className="p-px border border-dark1 rounded-md bg-light1 text-bodyTextDark"
              placeholder="Goal Amount"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Second Line: Starting Amount and Submit Button */}
          <div className="flex flex-col">
            <input
              type="number"
              onChange={(e) => setAmountActual(e.target.value)}
              value={amountActual}
              className="p-px border border-dark1 rounded-md bg-light1 text-bodyTextDark"
              placeholder="Starting Amount"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-button hover:bg-buttonHover text-bodyTextLight p-px rounded-md material-symbols-outlined"
            >
              check
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Goals;