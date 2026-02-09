import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../components/common/Button';
import React from 'react';

describe('Button Component', () => {
    it('renders correctly', () => {
        render(<Button variant="primary">Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
});
