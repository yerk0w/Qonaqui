package com.qonaqui.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.qonaqui.model.enums.Role;
import com.qonaqui.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return userRepository.findById(userId)
                .map(user -> {
                    Role role = user.getRole() != null ? user.getRole() : Role.CLIENT;
                    return new User(
                            user.getId(),
                            user.getPassword(),
                            List.of(new SimpleGrantedAuthority("ROLE_" + role.name())));
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
